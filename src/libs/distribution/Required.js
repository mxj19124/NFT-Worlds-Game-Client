export default class Required {
  /**
   * Parse a JSON object into a Required object.
   *
   * @param {Object} json A JSON object representing a Required object.
   *
   * @returns {Required} The parsed Required object.
   */

  static fromJSON(json) {
    if (json == null) {
      return new Required(true, true);
    } else {
      return new Required(json.value == null ? true : json.value, json.def == null ? true : json.def);
    }
  }

  constructor(value, def) {
    this.value = value;
    this.default = def;
  }

  /**
   * Get the default value for a required object. If a module
   * is not required, this value determines whether or not
   * it is enabled by default.
   *
   * @returns {boolean} The default enabled value.
   */

  isDefault() {
    return this.default;
  }

  /**
   * @returns {boolean} Whether or not the module is required.
   */

  isRequired() {
    return this.value;
  }
}
