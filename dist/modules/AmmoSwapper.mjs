import {constants, defaults, settings} from "./constants.mjs";
import BaseManager from "./managers/BaseManager.js";
import Error from "./utility/Error.js";
import ManagerFactory from "./ManagerFactory.mjs";

export default class AmmoSwapper extends Application {
  #positionTimeout;

  constructor(manager, options) {
    if (!(manager.prototype instanceof BaseManager)) {
      throw new Error('Invalid manager passed to AmmoSwapper constructor');
    }
    super(options);

    this.#setInitialPosition();

    this.manager = manager;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "workshop-ammo-swapper",
      template: `${constants.modulePath}/templates/ammo-swapper.hbs`,
      popOut: false,
      height: 52
    });
  }

  static init() {
    if (game.settings.get(constants.moduleId, settings.enable)) {
      if (game.user.character) {
        if (!(ui.ammoSwapper instanceof this)) {
          let manager = ManagerFactory.getManagerBySystem(game.system.id);
          ui.ammoSwapper = new this(manager);
        }
        ui.ammoSwapper.render(true);

        return ui.ammoSwapper;
      }
      ui.ammoSwapper?.close();
    }

    return undefined;
  }

  /** @override */
  getData(options) {
    let weapons = this.manager.weapons;

    return {
      weapons: weapons,
      empty: weapons.length === 0,
      displayQuantity: game.settings.get(constants.moduleId, settings.quantity)
    };
  }

  /**
   * @override
   */
  setPosition({left, top, width, height, scale} = {}) {
    // Need to temporarily set resizable = true, so that position is correctly set via Draggable
    this.options.resizable = true;
    const newPosition = super.setPosition({left: left, top: top, height: height});
    this.options.resizable = false;

    // If app is below the middle of the screen, ammo pops upwards, otherwise downward
    const ammoList = this.element.find('.ammunitions');
    const {innerHeight: windowHeight} = window;

    if (top > (windowHeight / 2)) {
      ammoList.css('bottom', newPosition.height);
      ammoList.css('top', 'auto');
    } else {
      ammoList.css('top', newPosition.height);
      ammoList.css('bottom', 'auto');
    }

    // Save current position as setting, but wait a bit after dragging ends
    if (this.#positionTimeout) {
      clearTimeout(this.#positionTimeout);
    }

    this.#positionTimeout = setTimeout(() => {
      game.settings.set(constants.moduleId, settings.position, JSON.stringify(this.position));
    }, defaults.positionTimeoutDelay);

    return newPosition;
  }

  /**
   * Sets the initial position based on saved setting, otherwise sets the initial position
   */
  #setInitialPosition() {
    const savedPosition = JSON.parse(game.settings.get(constants.moduleId, settings.position))

    if (savedPosition?.top) {
      this.position = savedPosition;
    } else {
      this.#setDefaultPosition(false);
    }
  }

  /**
   * Sets the position as default one and resets the position setting
   *
   * @param {boolean} savePosition
   */
  #setDefaultPosition(savePosition = true) {
    const {innerHeight: windowHeight} = window;
    const appHeight = this.position.height;
    const margin = defaults.marginBottom;

    let position = defaults.ammoSwapperPosition;
    position.top = windowHeight - appHeight - margin;
    this.position = position;

    if (savePosition) game.settings.set(constants.moduleId, settings.position, '{}')
  }

  resetPosition() {
    this.#setDefaultPosition(true);

    this.render();
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    document.addEventListener("click", _ev => {
      html.find('.ammunitions:visible').hide(300);
    });

    if (game.settings.get(constants.moduleId, settings.draggable)) {
      const dragHandle = html.find('.drag-handle');
      new Draggable(this, html, dragHandle[0], this.options.resizable);
      html[0].classList.add('draggable-enabled');
    }

    html.on('click', '.ammo', (event) => {
      event.stopPropagation();
      const ammo = $(event.currentTarget);
      const weapon = ammo.closest('.weapon');
      const weaponId = weapon.data('weapon-id');
      const ammoId = ammo.data('ammo-id');

      this.manager.setAmmunition(weaponId, ammoId).then(() => this.render());
    });

    html.on('click', '.weapon', (event) => {
      event.stopPropagation();
      html.find('.ammunitions:visible').hide(300);
      $(event.currentTarget).find('.ammunitions:hidden').show(300);
    });

    if (!game.settings.get(constants.moduleId, settings.onlyEquipped)) {
      html.on('auxclick', '.weapon', (event) => {
        event.stopPropagation();
        const weapon = $(event.currentTarget);
        const weaponId = weapon.data('weapon-id');
        this.manager.equipWeapon(weaponId).then(() => this.render());
      });
    }
  }

  render(force = false, options = {}) {
    if (game.user.character?.id) {
      return super.render(force, options);
    }
    this.close();

    return this;
  }
}