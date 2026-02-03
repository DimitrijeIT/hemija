let instance = null;

export class GameData {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._elements = [];
    this._molecules = [];
    this._chapters = [];
    this._experiments = [];
    this._elementMap = {};
    this._moleculeMap = {};
    this._experimentMap = {};
    this._starRating = {};
    this._rewards = {};
  }

  static getInstance() {
    if (!instance) new GameData();
    return instance;
  }

  init(elementsData, moleculesData, chaptersData, experimentsData) {
    this._elements = elementsData.elements;
    this._molecules = moleculesData.molecules;
    this._chapters = chaptersData.chapters;
    this._starRating = chaptersData.star_rating;
    this._rewards = chaptersData.rewards;

    for (const el of this._elements) {
      this._elementMap[el.id] = el;
    }
    for (const mol of this._molecules) {
      this._moleculeMap[mol.id] = mol;
    }

    if (experimentsData && experimentsData.experiments) {
      this._experiments = experimentsData.experiments;
      for (const exp of this._experiments) {
        this._experimentMap[exp.id] = exp;
      }
    }
  }

  getElement(id) {
    return this._elementMap[id];
  }

  getMolecule(id) {
    return this._moleculeMap[id];
  }

  getChapter(id) {
    return this._chapters.find(c => c.id === id);
  }

  get chapters() {
    return this._chapters;
  }

  get elements() {
    return this._elements;
  }

  get molecules() {
    return this._molecules;
  }

  get starRating() {
    return this._starRating;
  }

  get rewards() {
    return this._rewards;
  }

  getLevelConfig(chapterId, levelNumber) {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return null;
    const levelDef = chapter.levels.find(l => l.level_number === levelNumber);
    if (!levelDef) return null;
    const molecule = this.getMolecule(levelDef.molecule_id);
    return { ...levelDef, molecule, chapter };
  }

  getElementsForChapter(chapterId) {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return [];
    return chapter.elements_introduced.map(id => this.getElement(id)).filter(Boolean);
  }

  getAvailableElements(chapterId) {
    const result = [];
    for (const ch of this._chapters) {
      if (ch.id <= chapterId) {
        for (const elId of ch.elements_introduced) {
          const el = this.getElement(elId);
          if (el) result.push(el);
        }
      }
    }
    return result;
  }

  getRequiredElementsForMolecule(moleculeId) {
    const mol = this.getMolecule(moleculeId);
    if (!mol) return [];
    return mol.ingredients.map(ing => ({
      element: this.getElement(ing.element_id),
      count: ing.count
    }));
  }

  getExperiment(id) {
    return this._experimentMap[id];
  }

  get experiments() {
    return this._experiments;
  }

  getExperimentLevelConfig(chapterId, levelNumber) {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return null;
    const levelDef = chapter.levels.find(l => l.level_number === levelNumber);
    if (!levelDef || !levelDef.experiment_id) return null;
    const experiment = this.getExperiment(levelDef.experiment_id);
    return { ...levelDef, experiment, chapter };
  }
}
