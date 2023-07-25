import constants from "./constants.mjs";
import AmmoSwapper from "./AmmoSwapper.mjs";

export default function registerSettings() {
  game.settings.register(constants.moduleId, "enable", {
    name: "Forien.AmmoSwapper.Settings.enable.name",
    hint: "Forien.AmmoSwapper.Settings.enable.hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean,
    onChange: (value) => {
      if (value) AmmoSwapper.init();
      else ui.ammoSwapper?.close();
    }
  });

  game.settings.register(constants.moduleId, "quantity", {
    name: "Forien.AmmoSwapper.Settings.quantity.name",
    hint: "Forien.AmmoSwapper.Settings.quantity.hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean,
    onChange: (_value) => ui.ammoSwapper?.render()
  });
}