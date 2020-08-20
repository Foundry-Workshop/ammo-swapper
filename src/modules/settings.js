import constants from "./constants.js";
import AmmoSwapper from "./AmmoSwapper.js";

export default function registerSettings() {
  game.settings.register(constants.moduleName, "enable", {
    name: "WorkshopAmmoSwapper.Settings.enable.name",
    hint: "WorkshopAmmoSwapper.Settings.enable.hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean,
    onChange: (value) => {
      if (value) AmmoSwapper.init();
      else ui.ammoSwapper?.close();
    }
  });

  game.settings.register(constants.moduleName, "quantity", {
    name: "WorkshopAmmoSwapper.Settings.quantity.name",
    hint: "WorkshopAmmoSwapper.Settings.quantity.hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean,
    onChange: (value) => ui.ammoSwapper?.render()
  });
}