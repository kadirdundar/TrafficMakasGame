// Custom number plates (bought in the garage, see profile.js → buyPlate). A plate follows the
// Turkish format: province code 01-81, then 1 letter + 4 digits, 2 letters + 3-4 digits or
// 3 letters + 2-3 digits ("34 A 1234", "06 AB 123", "35 KRZ 35"). Only the Latin letters
// used on Turkish plates are allowed: no Ç Ğ İ Ö Ş Ü, and no Q W X.

const LETTERS = /^[ABCDEFGHIJKLMNOPRSTUVYZ]+$/;
const DIGITS_FOR_LETTERS = { 1: [4], 2: [3, 4], 3: [2, 3] };

// "34abc123", "34 ABC 123", "34-abc-123" → { plate: '34 ABC 123' } or { error: 'why not' }
export function parsePlate(raw) {
  const compact = String(raw ?? '')
    .toUpperCase()
    .replace(/[\s\-.]/g, '');
  if (!compact) return { error: 'Plaka yaz' };
  const m = /^(\d{2})([A-ZÇĞİÖŞÜ]{1,3})(\d{2,4})$/.exec(compact);
  if (!m) return { error: 'Biçim: 34 ABC 123' };
  const [, province, letters, digits] = m;
  const code = Number(province);
  if (code < 1 || code > 81) return { error: 'İl kodu 01-81 arası olmalı' };
  if (!LETTERS.test(letters)) return { error: 'Ç Ğ İ Ö Ş Ü Q W X kullanılamaz' };
  if (!DIGITS_FOR_LETTERS[letters.length].includes(digits.length)) {
    const allowed = DIGITS_FOR_LETTERS[letters.length].join(' ya da ');
    return { error: `${letters.length} harfle ${allowed} rakam olmalı` };
  }
  return { plate: `${province} ${letters} ${digits}` };
}

// A plate from storage or the network: the formatted plate, or null if it is not a valid one
export function cleanPlate(raw) {
  return typeof raw === 'string' ? (parsePlate(raw).plate ?? null) : null;
}
