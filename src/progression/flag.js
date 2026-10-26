// Temporary switch for the new version (car performance, coins and upgrades). Testers keep the
// current game until they turn it on in the garage; ?yeni=1 or ?yeni=0 in a shared link sets it
// too. Once the new version is the only one, this file and the classic path in main.js go.

const STORAGE_KEY = 'otoban_new_version';

export function isNewVersionEnabled() {
  try {
    const param = new URLSearchParams(window.location.search).get('yeni');
    if (param === '1' || param === '0') localStorage.setItem(STORAGE_KEY, param);
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch (_) {
    return false;
  }
}

export function setNewVersionEnabled(on) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  } catch (_) {}
}
