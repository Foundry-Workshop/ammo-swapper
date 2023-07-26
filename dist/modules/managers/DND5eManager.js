import BaseManager from "./BaseManager.js";
import {constants, settings} from "../constants.mjs";

export default class DND5eManager extends BaseManager {
  /**
   *
   * @return {Item5e[]}
   */
  static get weapons() {
    const actor = game.user.character;
    const items = actor.items;
    const checkEquipped = game.settings.get(constants.moduleId, settings.onlyEquipped);
    const weapons = items.filter(i => (i.type === 'weapon' && (checkEquipped ? i.system.equipped === true : true) && ["simpleR", "martialR"].includes(i.system.weaponType) && i.system.consume.type === 'ammo'));
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let selected = ammunition.find(a => a._id === w.system.consume.target);

      return {
        _id: w._id,
        img: w.img,
        name: w.name,
        selected: selected,
        ammunition: ammunition,
        equipped: !checkEquipped ? w.system.equipped : false
      }
    });
  }

  /**
   *
   * @return {Item5e[]}
   */
  static get ammunition() {
    const actor = game.user.character;
    const items = actor.items;
    let ammo = items.filter(i => i.type === 'consumable' && i.system.consumableType === 'ammo');

    return ammo.map(a => ({
      _id: a._id,
      img: a.img,
      name: a.name,
      quantity: a.system.quantity
    }));
  }

  /**
   *
   * @param {string} weaponId
   * @param {string} ammoId
   */
  static async setAmmunition(weaponId, ammoId) {
    const actor = game.user.character;
    const weapon = actor.items.find(i => i.id === weaponId);
    if (weapon) {
      await weapon.update({'system.consume.target': ammoId});
    }
  }

  /**
   *
   * @param {string} weaponId
   */
  static async equipWeapon(weaponId) {
    const actor = game.user.character;
    const item = actor.items.get(weaponId);

    return item.update({["system.equipped"]: !foundry.utils.getProperty(item, "system.equipped")});
  }
}