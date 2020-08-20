import BaseManager from "./BaseManager.js";

export default class DND5eManager extends BaseManager {
  /**
   *
   * @return {[]}
   */
  static get weapons() {
    const actor = game.user.character;
    const items = actor.items;
    const weapons = items.filter(i => (i.data.type === 'weapon' && i.data.data.equipped === true && i.data.data.weaponType === "martialR" && i.data.data.consume.type === 'ammo'));
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let selected = ammunition.find(a => a._id === w.data.data.consume.target);

      return {
        _id: w.data._id,
        img: w.data.img,
        name: w.data.name,
        selected: selected,
        ammunition: ammunition
      }
    });
  }

  /**
   *
   * @return {[]}
   */
  static get ammunition() {
    const actor = game.user.character;
    const items = actor.items;
    let ammo = items.filter(i => i.data.type === 'consumable' && i.data.data.consumableType === 'ammo');

    return ammo.map(a => ({
      _id: a.data._id,
      img: a.data.img,
      name: a.data.name,
      quantity: a.data.data.quantity
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