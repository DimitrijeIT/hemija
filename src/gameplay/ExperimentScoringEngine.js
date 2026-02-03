export class ExperimentScoringEngine {
  /**
   * @param {object} experiment - experiment data
   * @param {boolean} predictionCorrect - whether the prediction was correct
   * @param {boolean} isReplay - whether this is a replay attempt
   */
  static calculate(experiment, predictionCorrect, isReplay = false) {
    const basePoints = experiment.base_points;
    let stars;
    let predictionBonus;

    if (predictionCorrect && !isReplay) {
      // First attempt correct: 3 stars + 50% bonus
      stars = 3;
      predictionBonus = Math.round(basePoints * 0.5);
    } else if (predictionCorrect && isReplay) {
      // Replay correct: 2 stars + 25% bonus
      stars = 2;
      predictionBonus = Math.round(basePoints * 0.25);
    } else {
      // Wrong prediction: 1 star, no bonus
      stars = 1;
      predictionBonus = 0;
    }

    const totalScore = basePoints + predictionBonus;

    return {
      basePoints,
      predictionBonus,
      totalScore,
      stars,
      predictionCorrect
    };
  }
}
