import {constants} from "./constants.mjs";
import registerSettings from "./settings.mjs";
import Utility from "./utility/Utility.mjs";
import AmmoSwapperAPI from "./AmmoSwapperAPI.mjs";

Hooks.once('init', () => {
  registerSettings();
  game.modules.get(constants.moduleId).api = new AmmoSwapperAPI();

  Hooks.callAll(`${constants.moduleId}:afterInit`);
  Utility.notify(`${constants.moduleLabel} initialized`, {consoleOnly: true});
});

Hooks.once('setup', () => {
  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once("ready", () => {
  game.modules.get(constants.moduleId).api?.initializeAmmoSwapper();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify(`${constants.moduleLabel} ready`, {consoleOnly: true});
});

Hooks.on("updateUser", (user, data, _options, _userId) => {
  if (Object.keys(data).includes('character')) game.modules.get(constants.moduleId).api?.initializeAmmoSwapper();
});

Hooks.on("createItem", (item, _options, _userId) => {
  if (item.actor?.id === game.user.character?.id) game.modules.get(constants.moduleId).api?.render();
});

Hooks.on("updateItem", (item, _data, _diff, _userId) => {
  if (item.actor?.id === game.user.character?.id) game.modules.get(constants.moduleId).api?.render();
});