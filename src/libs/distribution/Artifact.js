export default class Artifact {
  /**
   * Parse a JSON object into an Artifact.
   *
   * @param {Object} json A JSON object representing an Artifact.
   *
   * @returns {Artifact} The parsed Artifact.
   */

  static fromJSON(json) {
    return Object.assign(new Artifact(), json);
  }

  /**
   * Get the MD5 hash of the artifact. This value may
   * be undefined for artifacts which are not to be
   * validated and updated.
   *
   * @returns {string} The MD5 hash of the Artifact or undefined.
   */

  getHash() {
    return this.MD5;
  }

  /**
   * @returns {number} The download size of the artifact.
   */

  getSize() {
    return this.size;
  }

  /**
   * @returns {string} The download url of the artifact.
   */

  getURL() {
    return this.url;
  }

  /**
   * @returns {string} The artifact's destination path.
   */

  getPath() {
    return this.path;
  }
}
