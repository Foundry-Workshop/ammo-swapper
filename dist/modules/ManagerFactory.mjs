import DND5eManager from "./managers/DND5eManager.js";
import Error from "./utility/Error.js";
import {constants} from "./constants.mjs";
import WFRP4eManager from "./managers/WFRP4eManager.js";
import PF2eManager from "./managers/PF2eManager.js";

export default class ManagerFactory {
  static getManagerBySystem(system) {
    switch (system) {
      case 'dnd5e':
        return DND5eManager;
      case 'wfrp4e':
        return WFRP4eManager;
      case 'pf2e':
        return PF2eManager;
      default:
        throw new Error(`System ${system} is not supported by ${constants.moduleLabel}.`)
    }
  }
}