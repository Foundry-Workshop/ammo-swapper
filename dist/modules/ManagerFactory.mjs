import Error from "./utility/Error.js";
import {constants} from "./constants.mjs";
import DND5eManager from "./managers/DND5eManager.js";
import PF1Manager from "./managers/PF1Manager.js";
import PF2eManager from "./managers/PF2eManager.js";
import WFRP4eManager from "./managers/WFRP4eManager.js";

export default class ManagerFactory {
  static async getManagerBySystem(system) {
    switch (system) {
      case 'dnd5e':
        return DND5eManager;
      case 'pf1':
        return PF1Manager;
      case 'pf2e':
        return PF2eManager;
      case 'sfrpg':
        // dynamic import because of heavy code dependency
        return await import("./managers/SFRPGManager.js");
      case 'wfrp4e':
        return WFRP4eManager;
      default:
        throw new Error(`System ${system} is not supported by ${constants.moduleLabel}.`)
    }
  }
}