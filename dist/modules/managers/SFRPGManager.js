import BaseManager from "./BaseManager.js";
import {constants, settings} from "../constants.mjs";
import { ActorItemHelper, getItemContainer, setItemContainer } from "/systems/sfrpg/module/actor/actor-inventory-utils.js"

export default class SFRPGManager extends BaseManager {
  /**
   *
   * @return {ItemSFRPG[]}
   */
  static get weapons() {
    const actor = this.character;
    const items = actor.items;
    const checkEquipped = game.settings.get(constants.moduleId, settings.onlyEquipped);
    const weapons = items.filter(i => (i.type === 'weapon' && (checkEquipped ? i.system.equipped === true : true) && i.system.ammunitionType !== ''));
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let selected = ammunition[w.system.ammunitionType].find(a => a.parentItem === w._id);

      return {
        _id: w._id,
        img: w.img,
        name: w.name,
        selected: selected,
        ammunition: ammunition[w.system.ammunitionType].filter(a => !a.hasCapacity || a.maxCapacity <= w.system.capacity.max),
        equipped: !checkEquipped ? w.system.equipped : false
      }
    });
  }

  /**
   *
   * @return {ItemSFRPG[]}
   */
  static get ammunition() {
    const actor = this.character;
    const items = actor.items;
    let ammo = items.filter(i => i.type === 'ammunition');
    let ammunition = {};

    ammo.forEach(a => {
      let ammoType = a.system.ammunitionType;
      if (ammunition[ammoType] === undefined)
        ammunition[ammoType] = [];

      ammunition[ammoType].push({
        _id: a._id,
        img: a.img,
        name: a.name,
        quantity: a.system.quantity,
        parentItem: a.parentItem?._id,
        hasCapacity: a.hasCapacity(),
        maxCapacity: a.maxCapacity || null
      })
    });

    return ammunition;
  }

  /**
   * I have no idea how it works, I mostly copied stuff from `item.reload()` function from sfrpg...
   *
   * @param {string} weaponId
   * @param {string} ammoId
   */
  static async setAmmunition(weaponId, ammoId) {
    const actor = this.character;
    /**
     * @type ItemSFRPG
     */
    const weapon = actor.items.find(i => i.id === weaponId);
    const ammo = actor.items.find(i => i.id === ammoId);
    let updatePromise = null;
    // Create actor item helper
    const tokenId = weapon.actor.isToken ? weapon.actor.token.id : null;
    const sceneId = weapon.actor.isToken ? weapon.actor.token.parent.id : null;
    const itemHelper = new ActorItemHelper(weapon.actor.id, tokenId, sceneId, {actor: weapon.actor});
    const maxCapacity = weapon.getMaxCapacity();

    const capacityItem = weapon.getCapacityItem();

    if (capacityItem) {
      await setItemContainer(itemHelper, capacityItem, null, capacityItem.quantity);
    }

    if (weapon.requiresCapacityItem()) {
      const newAmmunition = ammo;
      const originalContainer = getItemContainer(weapon.actor.items, newAmmunition);
      let totalAmountLoaded = 1;

      if (!newAmmunition.system.useCapacity) {
        totalAmountLoaded = Math.min(maxCapacity, newAmmunition.getCurrentCapacity());
      }

      updatePromise = await setItemContainer(itemHelper, newAmmunition, weapon, totalAmountLoaded);

      if (updatePromise && originalContainer) {
        ui.notifications.warn(game.i18n.format("SFRPG.ActorSheet.Inventory.Weapon.ReloadFromContainer", {
          name: weapon.name,
          ammoName: newAmmunition.name,
          containerName: originalContainer.name
        }), {permanent: true});
      }
    }

    if (updatePromise) {
      weapon._postReloadMessage();

      Hooks.callAll("itemReloaded", {actor: actor, item: weapon});
    }
  }

  /**
   *
   * @param {string} weaponId
   */
  static async equipWeapon(weaponId) {
    const actor = this.character;
    const weapon = actor.items.get(weaponId);

    return weapon.update({["system.equipped"]: !foundry.utils.getProperty(weapon, "system.equipped")});
  }
}