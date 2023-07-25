import constants from "./constants.mjs";
import BaseManager from "./managers/BaseManager.js";
import Error from "./utility/Error.js";
import ManagerFactory from "./ManagerFactory.mjs";

export default class AmmoSwapper extends Application {
  static _instance;

  constructor(manager, options) {
    if (!(manager.prototype instanceof BaseManager)) {
      throw new Error('Invalid manager passed to AmmoSwapper constructor');
    }
    super(options);

    this.manager = manager;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "workshop-ammo-swapper",
      template: `${constants.modulePath}/templates/ammo-swapper.hbs`,
      popOut: false
    });
  }

  /** @override */
  getData(options) {
    let weapons = this.manager.weapons;

    return {
      weapons: weapons,
      empty: weapons.length === 0,
      displayQuantity: game.settings.get(constants.moduleId, 'quantity')
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    document.addEventListener("click", _ev => {
      html.find('.ammunitions:visible').hide(300);
    });

    html.on('click', '.ammo', (event) => {
      event.stopPropagation();
      const ammo = $(event.currentTarget);
      const weapon = ammo.closest('.weapon');
      const weaponId = weapon.data("weapon-id");
      const ammoId = ammo.data("ammo-id");

      this.manager.setAmmunition(weaponId, ammoId).then(() => this.render());
    });

    html.on('click', '.weapon', (event) => {
      event.stopPropagation();
      html.find('.ammunitions:visible').hide(300);
      $(event.currentTarget).find('.ammunitions:hidden').show(300);
    });
  }

  static init() {
    if (game.user.character && game.settings.get(constants.moduleId, 'enable')) {
      if (!(ui.ammoSwapper instanceof this)) {
        let manager = ManagerFactory.getManagerBySystem(game.system.id);
        ui.ammoSwapper = new this(manager);
      }
      ui.ammoSwapper.render(true);

      return ui.ammoSwapper;
    }

    return undefined;
  }

  render(force = false, options = {}) {
    if (game.user.character?.id) {
      return super.render(force, options);
    }
    this.close();

    return this;
  }
}