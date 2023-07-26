import BaseManager from "./BaseManager.js";
import {constants, settings} from "../constants.mjs";

export default class PF1Manager extends BaseManager {
  /**
   *
   * @return {ItemWeaponPF[]}
   */
  static get weapons() {
    const actor = game.user.character;
    const items = actor.items;
    const checkEquipped = game.settings.get(constants.moduleId, settings.onlyEquipped);
    const weapons = items.filter(i => (i.type === 'weapon' && (checkEquipped ? i.system.equipped === true : true) && PF1Manager.#actionUsesAmmo(i) !== false));
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let ammoType = PF1Manager.#actionUsesAmmo(w);
      let selected = ammunition[ammoType]?.find(a => a._id === w.flags.pf1.defaultAmmo);

      return {
        _id: w._id,
        img: w.img,
        name: w.name,
        selected: selected,
        ammunition: ammunition[ammoType],
        equipped: !checkEquipped ? w.system.equipped : false
      }
    });
  }

  /**
   *
   * @param {ItemWeaponPF[]} weapon
   *
   * @return {boolean}
   */
  static #actionUsesAmmo(weapon) {
    for (let action of weapon.actions) {
      if (action.data.usesAmmo === true)
        return action.data.ammoType;
    }

    return false;
  }

  /**
   *
   * @return {ItemWeaponPF[]}
   */
  static get ammunition() {
    const actor = game.user.character;
    const items = actor.items;
    let ammo = items.filter(i => i.type === 'loot' && i.system.subType === 'ammo');
    let ammunition = {};

    ammo.forEach(a => {
      let ammoType = a.system.extraType;
      if (ammunition[ammoType] === undefined)
        ammunition[ammoType] = [];

      ammunition[ammoType].push({
        _id: a._id,
        img: a.img,
        name: a.name,
        quantity: a.system.quantity
      })
    });

    return ammunition;
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
      await weapon.setFlag('pf1', 'defaultAmmo', ammoId);
    }
  }

  /**
   *
   * @param {string} weaponId
   */
  static async equipWeapon(weaponId) {
    const actor = game.user.character;
    const weapon = actor.items.get(weaponId);

    return weapon.update({["system.equipped"]: !foundry.utils.getProperty(weapon, "system.equipped")});
  }
}