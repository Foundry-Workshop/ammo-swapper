export default class BaseManager {
  /**
   * Returns user's assigned Character, or if they are a GM, selected Token's Actor
   *
   * @returns {BaseActor|null}
   */
  static get character() {
    if (game.user.character)
      return game.user.character;

    if (!game.user.isGM) return null;

    const speaker = ChatMessage.implementation.getSpeaker();
    const token = canvas.ready ? canvas.tokens.get(speaker.token) : null;

    return token?.actor || game.actors.get(speaker.actor);
  }

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