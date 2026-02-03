/**
 * Electron shell configuration for game elements.
 * Hardcoded because elements.json uses shorthand electron_config (e.g. "3s1")
 * and we need full shell electron counts for orbital animations.
 */
const SHELL_MAP = {
  H:  [1],
  C:  [2, 4],
  N:  [2, 5],
  O:  [2, 6],
  Na: [2, 8, 1],
  Mg: [2, 8, 2],
  P:  [2, 8, 5],
  S:  [2, 8, 6],
  Cl: [2, 8, 7],
  K:  [2, 8, 8, 1],
  Ca: [2, 8, 8, 2],
  Fe: [2, 8, 14, 2]
};

export function getShellsForElement(element) {
  const symbol = typeof element === 'string' ? element : element.symbol;
  return SHELL_MAP[symbol] || null;
}

export function getTotalElectrons(element) {
  const shells = getShellsForElement(element);
  if (!shells) return 0;
  return shells.reduce((sum, n) => sum + n, 0);
}
