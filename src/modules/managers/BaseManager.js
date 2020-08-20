export default class BaseManager {
  /**
   *
   * @return {[]}
   */
  static get weapons() {}

  /**
   *
   * @return {[]}
   */
  static get ammunition() {}

  /**
   *
   * @param {string} weaponId
   * @param {string} ammoId
   */
  static async setAmmunition(weaponId, ammoId) {}
}