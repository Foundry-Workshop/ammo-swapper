import BaseManager from "./BaseManager.js";
import {constants, settings} from "../constants.mjs";
import Utility from "../utility/Utility.mjs";

export default class WFRP4eManager extends BaseManager {
  /**
   *
   * @return {ItemWfrp4e[]}
   */
  static get weapons() {
    const actor = game.user.character;
    const items = actor.items;
    const checkEquipped = game.settings.get(constants.moduleId, settings.onlyEquipped);
    const weapons = items.filter(i => i.type === 'weapon' && (checkEquipped ? i.system.equipped === true : true) && i.system.ammunitionGroup.value !== "none");
    const ammunition = this.ammunition;

    return weapons.map(w => {
      let ammo = ammunition[w.system.ammunitionGroup.value];
      let selected = ammo?.find(a => a._id === w.system.currentAmmo.value);

      return {
        _id: w._id,
        img: w.img,
        name: w.name,
        selected: selected,
        ammunition: ammo,
        equipped: !checkEquipped ? w.system.equipped : false
      }
    });
  }

  /**
   *
   * @return {ItemWfrp4e[]}
   */
  static get ammunition() {
    const actor = game.user.character;
    const items = actor.items;
    let ammo = items.filter(i => i.type === 'ammunition');
    let ammunition = {};
    ammo.forEach(a => {
      let ammoType = a.system.ammunitionType.value;
      if (ammunition[ammoType] === undefined)
        ammunition[ammoType] = [];

      ammunition[ammoType].push({
        _id: a._id,
        img: a.img,
        name: a.name,
        quantity: a.system.quantity.value
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
      return await weapon.update({'system.currentAmmo.value': ammoId});
    }
  }

  /**
   *
   * @param {string} weaponId
   */
  static async equipWeapon(weaponId) {
    const actor = game.user.character;
    const weapon = actor.items.find(i => i.id === weaponId).toObject();
    weapon.system.equipped = !weapon.system.equipped;
    let equippedState = weapon.system.equipped;
    let newEqpPoints = weapon.system.twohanded.value ? 2 : 1;

    if (game.settings.get("wfrp4e", "limitEquippedWeapons")) {
      if (actor.equipPointsUsed + newEqpPoints > actor.equipPointsAvailable && equippedState) {
        try {
          AudioHelper.play({src: `${game.settings.get("wfrp4e", "soundPath")}/no.wav`}, false);
        } catch (error) {
          Utility.notify("Error playing WFRP4e sound", {type: 'warning', consoleOnly: true});
        }

        return Utility.notify(game.i18n.localize("ErrorLimitedWeapons"), {type: 'error'});
      }
    }

    setProperty(weapon, "system.offhand.value", false);
    await actor.updateEmbeddedDocuments("Item", [weapon]);

    try {
      WFRP_Audio.PlayContextAudio({item: actor.items.get(weaponId), action: "equip", outcome: equippedState});
    } catch (error) {
      Utility.notify("Error playing WFRP4e sound", {type: 'warning', consoleOnly: true});
    }
  }
}