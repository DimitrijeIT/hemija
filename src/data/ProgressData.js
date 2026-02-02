import { SaveManager } from '../core/SaveManager.js';
import { GameData } from './GameData.js';

let instance = null;

export class ProgressData {
  constructor() {
    if (instance) return instance;
    instance = this;
    this._save = SaveManager.getInstance();
  }

  static getInstance() {
    if (!instance) new ProgressData();
    return instance;
  }

  get progress() {
    return this._save.data.progress;
  }

  getLevelKey(chapterId, levelNumber) {
    return `ch${chapterId}_lv${levelNumber}`;
  }

  getLevelProgress(chapterId, levelNumber) {
    const key = this.getLevelKey(chapterId, levelNumber);
    return this.progress.levels[key] || null;
  }

  saveLevelResult(chapterId, levelNumber, stars, score) {
    const key = this.getLevelKey(chapterId, levelNumber);
    const existing = this.progress.levels[key];
    const isFirstTime = !existing;

    if (!existing || stars > existing.stars || (stars === existing.stars && score > existing.score)) {
      const oldStars = existing ? existing.stars : 0;
      this.progress.levels[key] = { stars, score, completed: true };
      this.progress.totalStars += (stars - oldStars);
    }

    const gameData = GameData.getInstance();
    const levelConfig = gameData.getLevelConfig(chapterId, levelNumber);
    if (levelConfig && levelConfig.molecule) {
      const molId = levelConfig.molecule.id;
      if (!this.progress.discoveredMolecules.includes(molId)) {
        this.progress.discoveredMolecules.push(molId);
      }
      for (const ing of levelConfig.molecule.ingredients) {
        if (!this.progress.discoveredElements.includes(ing.element_id)) {
          this.progress.discoveredElements.push(ing.element_id);
        }
      }
    }

    let coinsEarned = stars * gameData.rewards.level_complete.coins_per_star;
    if (isFirstTime) {
      coinsEarned += gameData.rewards.level_complete.first_time_bonus;
    }
    this.progress.totalCoins += coinsEarned;

    const chapter = gameData.getChapter(chapterId);
    if (chapter) {
      const allDone = chapter.levels.every(lv => {
        const p = this.getLevelProgress(chapterId, lv.level_number);
        return p && p.completed;
      });
      if (allDone && !this.progress.chaptersCompleted.includes(chapterId)) {
        this.progress.chaptersCompleted.push(chapterId);
        this.progress.totalCoins += gameData.rewards.chapter_complete.coins_bonus;
      }
    }

    this._save.save();
    return coinsEarned;
  }

  getChapterStars(chapterId) {
    const gameData = GameData.getInstance();
    const chapter = gameData.getChapter(chapterId);
    if (!chapter) return 0;
    let total = 0;
    for (const lv of chapter.levels) {
      const p = this.getLevelProgress(chapterId, lv.level_number);
      if (p) total += p.stars;
    }
    return total;
  }

  getTotalStars() {
    return this.progress.totalStars;
  }

  getTotalCoins() {
    return this.progress.totalCoins;
  }

  isLevelUnlocked(chapterId, levelNumber) {
    const gameData = GameData.getInstance();
    const chapter = gameData.getChapter(chapterId);
    if (!chapter) return false;

    if (chapter.unlock_requirement) {
      const reqStars = this.getChapterStars(chapter.unlock_requirement.chapter_id);
      if (reqStars < chapter.unlock_requirement.min_stars) return false;
    }

    const levelDef = chapter.levels.find(l => l.level_number === levelNumber);
    if (!levelDef) return false;
    return this.getChapterStars(chapterId) >= levelDef.stars_to_unlock;
  }

  isChapterUnlocked(chapterId) {
    const gameData = GameData.getInstance();
    const chapter = gameData.getChapter(chapterId);
    if (!chapter) return false;
    if (!chapter.unlock_requirement) return true;
    const reqStars = this.getChapterStars(chapter.unlock_requirement.chapter_id);
    return reqStars >= chapter.unlock_requirement.min_stars;
  }

  reset() {
    this._save.reset();
  }
}
