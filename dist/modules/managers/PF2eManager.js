import BaseManager from "./BaseManager.js";
import {constants, settings} from "../constants.mjs";

export default class PF2eManager extends BaseManager {
  /**
   *
   * @return {_WeaponPF2e2[]}
   */
  static get weapons() {
    const actor = game.user.character;
    const items = actor.items;
    const checkEquipped = game.settings.get(constants.moduleId, settings.onlyEquipped);
    const weapons = items.filter(i => (i.type === 'weapon' && (checkEquipped ? i.system.equipped.carryType === 'held' : true) && i.requiresAmmo === true));
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let selected = ammunition.find(a => a._id === w.system.selectedAmmoId);

      return {
        _id: w._id,
        img: w.img,
        name: w.name,
        selected: selected,
        ammunition: ammunition,
        equipped: !checkEquipped ? w.system.equipped.carryType === 'held' : false
      }
    });
  }

  /**
   *
   * @return {_WeaponPF2e2[]}
   */
  static get ammunition() {
    const actor = game.user.character;
    const items = actor.items;
    // No ammo types in PF2e?
    let ammo = items.filter(i => i.type === 'consumable' && i.system.consumableType.value === 'ammo');

    return ammo.map(a => {
      let quantity = a.system.quantity;
      if (a.system.charges?.max > 0)
        quantity = `${a.system.charges.value}/${a.system.charges.max}`;

      return {
        _id: a._id,
        img: a.img,
        name: a.name,
        quantity: quantity
      }
    });
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
      await weapon.update({'system.selectedAmmoId': ammoId});
    }
  }

  /**
   *
   * @param {string} weaponId
   */
  static async equipWeapon(weaponId) {
    const actor = game.user.character;
    const weapon = actor.items.get(weaponId).toObject();

    if (weapon.system.equipped.carryType === "held") {
      weapon.system.equipped.handsHeld = 0;
      weapon.system.equipped.carryType = 'worn';
    } else {
      let usage = weapon.system.usage.value;
      let hands;
      switch (usage) {
        case "held-in-two-hands":
          hands = 2;
          break;
        case "held-in-one-hand":
        default:
          hands = 1;
      }

      weapon.system.equipped.carryType = 'held';
      weapon.system.equipped.handsHeld = hands;
    }

    return actor.updateEmbeddedDocuments("Item", [weapon]);
  }
}