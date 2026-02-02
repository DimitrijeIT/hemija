export class MoleculeVerifier {
  static verify(filledElements, molecule) {
    // Build expected counts from molecule ingredients
    const expected = {};
    for (const ing of molecule.ingredients) {
      expected[ing.element_id] = (expected[ing.element_id] || 0) + ing.count;
    }

    // Build actual counts from filled slots
    const actual = {};
    for (const el of filledElements) {
      actual[el.id] = (actual[el.id] || 0) + 1;
    }

    // Compare
    const expectedKeys = Object.keys(expected).sort();
    const actualKeys = Object.keys(actual).sort();

    if (expectedKeys.length !== actualKeys.length) {
      return { correct: false, reason: 'wrong_elements' };
    }

    for (const key of expectedKeys) {
      if (!actual[key]) {
        return { correct: false, reason: 'wrong_elements' };
      }
      if (actual[key] !== expected[key]) {
        return { correct: false, reason: 'wrong_count' };
      }
    }

    return { correct: true };
  }
}
