export default class BaseManager {
  /**
   *
   * @return {Item[]}
   */
  static get weapons() {}

  /**
   *
   * @return {Item[]}
   */
  static get ammunition() {}

  /**
   *
   * @param {string} weaponId
   * @param {string} ammoId
   */
  static async setAmmunition(weaponId, ammoId) {}

  /**
   *
   * @param {string} weaponId
   */
  static async equipWeapon(weaponId) {}
}