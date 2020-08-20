import constants from "./constants.js";
import registerSettings from "./settings.js";
import AmmoSwapper from "./AmmoSwapper.js";
import ManagerFactory from "./ManagerFactory.js";

Hooks.once('init', () => {
  registerSettings();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  AmmoSwapper.init();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});

Hooks.on("updateUser", (user, data, options, userId) => {
  console.log(data);
  console.log(Object.keys(data));
  if (Object.keys(data).includes('character')) ui.ammoSwapper?.render(true);
});

Hooks.on("updateActor", (actor, data, options, userId) => {
  if (actor.id === game.user.character?.id) ui.ammoSwapper?.render();
});

Hooks.on("updateOwnedItem", (actor, item, data, options, userId) => {
  if (actor.id === game.user.character?.id) ui.ammoSwapper?.render();
});