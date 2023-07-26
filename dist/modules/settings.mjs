import {constants, settings} from './constants.mjs';
import AmmoSwapper from './AmmoSwapper.mjs';


export default function registerSettings() {
  game.settings.register(constants.moduleId, settings.enable, {
    name: 'Forien.AmmoSwapper.Settings.enable.name',
    hint: 'Forien.AmmoSwapper.Settings.enable.hint',
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
    onChange: (value) => {
      if (value) AmmoSwapper.init();
      else ui.ammoSwapper?.close();
    }
  });

  game.settings.register(constants.moduleId, settings.quantity, {
    name: 'Forien.AmmoSwapper.Settings.quantity.name',
    hint: 'Forien.AmmoSwapper.Settings.quantity.hint',
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
    onChange: (_value) => ui.ammoSwapper?.render()
  });

  game.settings.register(constants.moduleId, settings.onlyEquipped, {
    name: 'Forien.AmmoSwapper.Settings.onlyEquipped.name',
    hint: 'Forien.AmmoSwapper.Settings.onlyEquipped.hint',
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
    onChange: (_value) => ui.ammoSwapper?.render()
  });

  game.settings.register(constants.moduleId, settings.draggable, {
    name: 'Forien.AmmoSwapper.Settings.draggable.name',
    hint: 'Forien.AmmoSwapper.Settings.draggable.hint',
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
    onChange: (_value) => ui.ammoSwapper?.render()
  });

  game.settings.register(constants.moduleId, settings.resetPosition, {
    name: 'Forien.AmmoSwapper.Settings.resetPosition.name',
    hint: 'Forien.AmmoSwapper.Settings.resetPosition.hint',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: (value) => {
      if (value === true) {
        ui.ammoSwapper?.resetPosition();
        game.settings.set(constants.moduleId, settings.resetPosition, false);
      }
    }
  });

  game.settings.register(constants.moduleId, settings.position, {
    scope: 'client',
    config: false,
    default: '{}',
  });
}