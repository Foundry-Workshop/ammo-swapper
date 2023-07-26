import {constants} from "./constants.mjs";
import registerSettings from "./settings.mjs";
import AmmoSwapper from "./AmmoSwapper.mjs";
import Utility from "./utility/Utility.mjs";

Hooks.once('init', () => {
  registerSettings();

  Hooks.callAll(`${constants.moduleId}:afterInit`);
  Utility.notify("Ammo Swapper initialized", {consoleOnly: true});
});

Hooks.once('setup', () => {
  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once("ready", () => {
  AmmoSwapper.init();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify("Ammo Swapper ready", {consoleOnly: true});
});

Hooks.on("updateUser", (user, data, _options, _userId) => {
  if (Object.keys(data).includes('character')) AmmoSwapper.init();
});

Hooks.on("updateItem", (item, _data, _diff, _userId) => {
  if (item.actor?.id === game.user.character?.id) ui.ammoSwapper?.render();
});