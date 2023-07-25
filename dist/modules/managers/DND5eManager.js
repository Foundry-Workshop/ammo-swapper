import BaseManager from "./BaseManager.js";

export default class DND5eManager extends BaseManager {
  /**
   *
   * @return {Item5e[]}
   */
  static get weapons() {
    const actor = game.user.character;
    const items = actor.items;
    const weapons = items.filter(i => (i.type === 'weapon' && i.system.equipped === true && ["simpleR", "martialR"].includes(i.system.weaponType) && i.system.consume.type === 'ammo'));
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let selected = ammunition.find(a => a._id === w.system.consume.target);

      return {
        _id: w._id,
        img: w.img,
        name: w.name,
        selected: selected,
        ammunition: ammunition
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
      await weapon.update({'data.consume.target': ammoId});
    }
  }
}