import constants from "../constants.js";

export default class WorkshopError extends Error {
  constructor(error) {
    error = `${constants.moduleLabel} | ${error}`;
    super(error);
  }
}