import BaseManager from "./managers/BaseManager.js";
import Error from "./utility/Error.js";
import AmmoSwapper from "./AmmoSwapper.mjs";
import ManagerFactory from "./ManagerFactory.mjs";

export default class AmmoSwapperAPI {
  #manager;
  #instance;

  get #getManager() {
    if (this.#manager instanceof BaseManager) {
      return this.#manager;
    }

    return ManagerFactory.getManagerBySystem(game.system.id);
  }

  /**
   * Get class of BaseManager
   *
   * @return {BaseManager}
   * @constructor
   */
  get BaseManager() {
    return BaseManager;
  }

  /**
   * Set a new manager that extends the BaseManager to support your system
   *
   * @param {BaseManager} manager
   */
  setSystemManager(manager) {
    if (!(manager.prototype instanceof BaseManager)) {
      throw new Error('Invalid manager passed to AmmoSwapper constructor!');
    }

    this.#manager = manager;
  }

  /**
   * Initializes AmmoSwapper with provided or predefined Manager
   */
  async initializeAmmoSwapper() {
    let manager = await this.#getManager;
    this.#instance = AmmoSwapper.init(manager);
  }

  /**
   * Renders/refreshes the Ammo Swapper ui
   *
   * @param force
   * @param options
   */
  render(force = false, options = {}) {
    this.#instance?.render(force, options);
  }
}