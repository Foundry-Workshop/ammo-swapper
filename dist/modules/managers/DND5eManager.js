import BaseManager from "./BaseManager.js";
import {constants, settings} from "../constants.mjs";

export default class DND5eManager extends BaseManager {
  /**
   *
   * @return {Item5e[]}
   */
  static get weapons() {
    const actor = this.character;
    const items = actor.items;
    const checkEquipped = game.settings.get(constants.moduleId, settings.onlyEquipped);
    const weapons = this.filterWeapons(items, checkEquipped);
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

  static filterWeapons(items, checkEquipped) {
    if (foundry.utils.isNewerVersion(game.system.version, '3.0.0'))
      return items.filter(i => (
        i.type === 'weapon' &&
        (checkEquipped ? i.system.equipped === true : true) &&
        ["simpleR", "martialR"].includes(i.system.type.value) &&
        i.system.consume.type === 'ammo'
      ));

    // Support DND 5e < 3.0.0
    return items.filter(i => (
      i.type === 'weapon' &&
      (checkEquipped ? i.system.equipped === true : true) &&
      ["simpleR", "martialR"].includes(i.system.weaponType) &&
      i.system.consume.type === 'ammo'
    ));
  }

  /**
   *
   * @return {Item5e[]}
   */
  static get ammunition() {
    const actor = this.character;
    const items = actor.items;
    const ammo = this.filterAmmo(items);

    return ammo.map(a => ({
      _id: a._id,
      img: a.img,
      name: a.name,
      quantity: a.system.quantity
    }));
  }

  static filterAmmo(items) {
    if (foundry.utils.isNewerVersion(game.system.version, '3.0.0'))
      return items.filter(i => i.type === 'consumable' && i.system.type.value === 'ammo');

    // Support DND 5e < 3.0.0
    return items.filter(i => i.type === 'consumable' && i.system.consumableType === 'ammo');
  }

  /**
   *
   * @param {string} weaponId
   * @param {string} ammoId
   */
  static async setAmmunition(weaponId, ammoId) {
    const actor = this.character;
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
    const actor = this.character;
    const item = actor.items.get(weaponId);

    return item.update({["system.equipped"]: !foundry.utils.getProperty(item, "system.equipped")});
  }
}