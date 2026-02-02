import { GAME_CONFIG } from '../core/Constants.js';

export class HintSystem {
  constructor() {
    this._hintsUsed = 0;
    this._maxHints = GAME_CONFIG.MAX_HINTS_PER_LEVEL;
  }

  get hintsUsed() { return this._hintsUsed; }
  get hintsRemaining() { return this._maxHints - this._hintsUsed; }
  get canUseHint() { return this._hintsUsed < this._maxHints; }

  useHint(molecule) {
    if (!this.canUseHint) return null;
    this._hintsUsed++;
    return molecule.hint_text;
  }

  reset() {
    this._hintsUsed = 0;
  }
}
