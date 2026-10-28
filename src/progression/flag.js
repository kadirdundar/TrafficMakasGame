// The progression system (car performance, coins, upgrades and purchases) is now the default
// and permanent game mode.

export function isNewVersionEnabled() {
  return true;
}

export function setNewVersionEnabled(_on) {
  // Mode selection is retired; progression mode is always enabled.
}
