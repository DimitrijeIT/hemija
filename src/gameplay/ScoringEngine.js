import { GAME_CONFIG } from '../core/Constants.js';

export class ScoringEngine {
  static calculate(molecule, timeRemaining, totalTime, hintsUsed) {
    const basePoints = molecule.base_points;
    const timeRatio = timeRemaining / totalTime;
    const timeBonus = Math.round(basePoints * (GAME_CONFIG.TIME_BONUS_MAX_PERCENT / 100) * timeRatio);
    const hintPenalty = hintsUsed * GAME_CONFIG.HINT_PENALTY_POINTS;
    const totalScore = Math.max(0, basePoints + timeBonus - hintPenalty);

    let stars;
    if (timeRatio >= 0.5 && hintsUsed === 0) {
      stars = 3;
    } else if (timeRatio >= 0.25 && hintsUsed <= 1) {
      stars = 2;
    } else {
      stars = 1;
    }

    return {
      basePoints,
      timeBonus,
      hintPenalty,
      totalScore,
      stars,
      timeRatio
    };
  }
}
