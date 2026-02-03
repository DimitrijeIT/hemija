import { Game } from './core/Game.js';
import { AssetLoader } from './core/AssetLoader.js';
import { Localization } from './core/Localization.js';
import { GameData } from './data/GameData.js';
import { ProgressData } from './data/ProgressData.js';
import { SceneManager } from './core/SceneManager.js';
import { AudioManager } from './core/AudioManager.js';
import { SCENES } from './core/Constants.js';
import { SplashScene } from './scenes/SplashScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { ChapterSelectScene } from './scenes/ChapterSelectScene.js';
import { GameplayScene } from './scenes/GameplayScene.js';
import { LevelCompleteScene } from './scenes/LevelCompleteScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { LaboratoryScene } from './scenes/LaboratoryScene.js';
import { ExperimentScene } from './scenes/ExperimentScene.js';

async function boot() {
  const game = Game.getInstance();
  await game.init();

  const sceneManager = SceneManager.getInstance();
  sceneManager.init(game);

  sceneManager.register(SCENES.SPLASH, SplashScene);
  sceneManager.register(SCENES.MENU, MenuScene);
  sceneManager.register(SCENES.CHAPTER_SELECT, ChapterSelectScene);
  sceneManager.register(SCENES.GAMEPLAY, GameplayScene);
  sceneManager.register(SCENES.LEVEL_COMPLETE, LevelCompleteScene);
  sceneManager.register(SCENES.SETTINGS, SettingsScene);
  sceneManager.register(SCENES.LABORATORY, LaboratoryScene);
  sceneManager.register(SCENES.EXPERIMENT, ExperimentScene);

  sceneManager.switchTo(SCENES.SPLASH);
}

boot().catch(err => console.error('HemiLab boot failed:', err));
