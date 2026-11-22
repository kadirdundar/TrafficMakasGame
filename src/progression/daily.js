import { MISSIONS, MISSIONS_BONUS, MISSIONS_PER_DAY, STREAK_REWARDS } from './config.js';

// What brings a player back each day: a login reward that grows with every day in a row, and
// three missions that pay coins as they are done (numbers in src/progression/config.js).
// Kept in the profile's save (profile.data.daily):
//   day       the date the missions below belong to ('YYYY-MM-DD', local time)
//   missions  [{ stat, goal, reward, progress, done }]
//   bonus     whether the all-missions bonus was paid today
//   streak    days in a row the login reward was taken, up to `claimed`
//   claimed   the last date the login reward was taken
// The drive reports what happens through add() (counts that add up over the day) and best()
// (the best single drive's score and combo); both are cheap enough to call every frame.

const pad = (n) => String(n).padStart(2, '0');
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function yesterdayKey(now) {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// The day's missions, the same for everyone on that date: a shuffle of the pool seeded by it
function pickMissions(day) {
  const rand = mulberry32(seedOf(day));
  const pool = [...MISSIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, MISSIONS_PER_DAY).map((m) => {
    const [goal, reward] = m.goals[Math.floor(rand() * m.goals.length)];
    return { stat: m.stat, goal, reward, progress: 0, done: false };
  });
}

const spec = (stat) => MISSIONS.find((m) => m.stat === stat);

export function missionText(m) {
  return spec(m.stat)?.text(m.goal) ?? '';
}

// "12,4 / 20 km", "1:23 / 3:00", "41.250 / 60.000"
export function missionProgressText(m) {
  const n = Math.min(m.progress, m.goal);
  if (m.stat === 'fastSec') {
    const t = (s) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
    return `${t(n)} / ${t(m.goal)}`;
  }
  if (m.stat === 'km') return `${n.toFixed(1).replace('.', ',')} / ${m.goal} km`;
  if (m.stat === 'combo') return `${n.toFixed(1).replace('.', ',')}x / ${m.goal}x`;
  return `${Math.floor(n).toLocaleString('tr-TR')} / ${m.goal.toLocaleString('tr-TR')}`;
}

export class DailyGoals {
  // onDone(mission, bonus): a mission was just done and its reward (plus the bonus, when it was
  // the day's last) paid into the profile
  constructor(profile, { onDone } = {}) {
    this.profile = profile;
    this.onDone = onDone;
    this.refresh();
  }

  get data() {
    return this.profile.data.daily;
  }

  // New missions once the date has changed; true when it had
  refresh(now = new Date()) {
    const day = dayKey(now);
    const d = this.data;
    if (d.day === day && Array.isArray(d.missions) && d.missions.length) return false;
    d.day = day;
    d.missions = pickMissions(day);
    d.bonus = false;
    this.profile.flush();
    return true;
  }

  missions() {
    return this.data.missions ?? [];
  }

  doneCount() {
    return this.missions().filter((m) => m.done).length;
  }

  // Login reward: { claimable, day (1, 2, … in a row), reward, rewards (the 7-day table) }
  streak(now = new Date()) {
    const d = this.data;
    const today = dayKey(now);
    const takenToday = d.claimed === today;
    const continues = d.claimed === yesterdayKey(now);
    const day = takenToday ? d.streak || 1 : continues ? (d.streak || 0) + 1 : 1;
    const reward = STREAK_REWARDS[Math.min(day, STREAK_REWARDS.length) - 1];
    return { claimable: !takenToday, day, reward, rewards: STREAK_REWARDS };
  }

  // Takes today's login reward; the coins paid (0 when it was already taken)
  claimStreak(now = new Date()) {
    const s = this.streak(now);
    if (!s.claimable) return 0;
    this.data.streak = s.day;
    this.data.claimed = dayKey(now);
    this.profile.earn(s.reward);
    this.profile.flush();
    return s.reward;
  }

  // A count that adds up over the day (km, makas, razor, sollama, fastSec, laps)
  add(stat, amount) {
    if (!(amount > 0)) return;
    for (const m of this.missions()) {
      if (m.stat !== stat || m.done) continue;
      m.progress += amount;
      this.check(m);
    }
  }

  // A best single drive (score, combo): the drive's value so far
  best(stat, value) {
    for (const m of this.missions()) {
      if (m.stat !== stat || m.done || !(value > m.progress)) continue;
      m.progress = value;
      this.check(m);
    }
  }

  check(m) {
    if (m.progress < m.goal) {
      this.profile.scheduleSave();
      return;
    }
    m.progress = m.goal;
    m.done = true;
    this.profile.earn(m.reward);
    let bonus = 0;
    if (!this.data.bonus && this.missions().every((x) => x.done)) {
      this.data.bonus = true;
      bonus = MISSIONS_BONUS;
      this.profile.earn(bonus);
    }
    this.profile.flush();
    this.onDone?.(m, bonus);
  }
}
