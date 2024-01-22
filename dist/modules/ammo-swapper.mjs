import {constants} from "./constants.mjs";
import registerSettings from "./settings.mjs";
import Utility from "./utility/Utility.mjs";
import AmmoSwapperAPI from "./AmmoSwapperAPI.mjs";
import BaseManager from "./managers/BaseManager.js";

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

/**
 * User configuration changed
 * Check if character was changed and initialize HUD
 */
Hooks.on("updateUser", (user, data, _options, _userId) => {
  if (Object.keys(data).includes('character'))
    game.modules.get(constants.moduleId).api?.initializeAmmoSwapper();
});

Hooks.on("createItem", (item, _options, _userId) => {
  if (item.actor?._id === BaseManager.character?._id)
    game.modules.get(constants.moduleId).api?.render();
});

Hooks.on("updateItem", (item, _data, _diff, _userId) => {
  if (item.actor?._id === BaseManager.character?._id)
    game.modules.get(constants.moduleId).api?.render();
});

Hooks.on("deleteItem", (item, _sheet, _options) => {
  if (item.actor?._id === BaseManager.character?._id)
    game.modules.get(constants.moduleId).api?.render();
});


let tokenControlledTimeout = null;
Hooks.on("controlToken", (_token, selected) => {
  if (!game.user.isGM) return;

  if (tokenControlledTimeout)
    clearTimeout(tokenControlledTimeout);

  tokenControlledTimeout = setTimeout(
    () => {
      game.modules.get(constants.moduleId).api?.render(true);
    },
    200
  );
})