import path from 'path';
import Artifact from './Artifact';
import Required from './Required';
import maestro from '../../maestro';

const { appSystemHelper } = maestro.helpers;

const MODULE_TYPES = {
  Library: 'Library',
  ForgeHosted: 'ForgeHosted',
  Forge: 'Forge', // Unimplemented
  LiteLoader: 'LiteLoader',
  ForgeMod: 'ForgeMod',
  LiteMod: 'LiteMod',
  File: 'File',
  VersionManifest: 'VersionManifest',
};

export default class Module {
  /**
   * Parse a JSON object into a Module.
   *
   * @param {Object} json A JSON object representing a Module.
   * @param {string} serverid The ID of the server to which this module belongs.
   *
   * @returns {Module} The parsed Module.
   */

  static fromJSON(json, serverid) {
    return new Module(
      json.id,
      json.name,
      json.type,
      json.required,
      json.artifact,
      json.subModules,
      serverid,
    );
  }

  /**
   * Returns MODULE_TYPES constant.
   *
   * @returns {MODULE_TYPES} Module types mapping object
   */

  static getModuleTypes() {
    return MODULE_TYPES;
  }

  /**
   * Resolve the default extension for a specific module type.
   *
   * @param {string} type The type of the module.
   *
   * @return {string} The default extension for the given type.
   */

  static _resolveDefaultExtension(type) {
    switch (type) {
      case MODULE_TYPES.Library:
      case MODULE_TYPES.ForgeHosted:
      case MODULE_TYPES.LiteLoader:
      case MODULE_TYPES.ForgeMod:
        return 'jar';
      case MODULE_TYPES.LiteMod:
        return 'litemod';
      case MODULE_TYPES.File:
      default:
        return 'jar'; // There is no default extension really.
    }
  }

  constructor(id, name, type, required, artifact, subModules, serverid) {
    this.identifier = id;
    this.type = type;
    this._resolveMetaData();
    this.name = name;
    this.required = Required.fromJSON(required);
    this.artifact = Artifact.fromJSON(artifact);
    this._resolveArtifactPath(artifact.path, serverid);
    this._resolveSubModules(subModules, serverid);
  }

  _resolveMetaData() {
    try {
      const m0 = this.identifier.split('@');

      this.artifactExt = m0[1] || Module._resolveDefaultExtension(this.type);

      const m1 = m0[0].split(':');

      this.artifactClassifier = m1[3] || undefined;
      this.artifactVersion = m1[2] || '???';
      this.artifactID = m1[1] || '???';
      this.artifactGroup = m1[0] || '???';
    } catch (err) {
      // Improper identifier
      console.log('Improper ID for module', this.identifier, err);
    }
  }

  _resolveArtifactPath(artifactPath, serverid) {
    const pth = artifactPath == null ? path.join(...this.getGroup().split('.'), this.getID(), this.getVersion(), `${this.getID()}-${this.getVersion()}${this.artifactClassifier != undefined ? `-${this.artifactClassifier}` : ''}.${this.getExtension()}`) : artifactPath;

    switch (this.type) {
      case MODULE_TYPES.Library:
      case MODULE_TYPES.ForgeHosted:
      case MODULE_TYPES.LiteLoader:
        this.artifact.path = path.join(appSystemHelper.getCommonDirectory(), 'libraries', pth);
        break;
      case MODULE_TYPES.ForgeMod:
      case MODULE_TYPES.LiteMod:
        this.artifact.path = path.join(appSystemHelper.getCommonDirectory(), 'modstore', pth);
        break;
      case MODULE_TYPES.VersionManifest:
        this.artifact.path = path.join(appSystemHelper.getCommonDirectory(), 'versions', this.getIdentifier(), `${this.getIdentifier()}.json`);
        break;
      case MODULE_TYPES.File:
      default:
        this.artifact.path = path.join(appSystemHelper.getInstanceDirectory(), serverid, pth);
        break;
    }
  }

  _resolveSubModules(json, serverid) {
    const arr = [];

    if (json != null) {
      for (const sm of json) {
        arr.push(Module.fromJSON(sm, serverid));
      }
    }

    this.subModules = arr.length > 0 ? arr : null;
  }

  /**
   * @returns {string} The full, unparsed module identifier.
   */

  getIdentifier() {
    return this.identifier;
  }

  /**
   * @returns {string} The name of the module.
   */

  getName() {
    return this.name;
  }

  /**
   * @returns {Required} The required object declared by this module.
   */

  getRequired() {
    return this.required;
  }

  /**
   * @returns {Artifact} The artifact declared by this module.
   */

  getArtifact() {
    return this.artifact;
  }

  /**
   * @returns {string} The maven identifier of this module's artifact.
   */

  getID() {
    return this.artifactID;
  }

  /**
   * @returns {string} The maven group of this module's artifact.
   */

  getGroup() {
    return this.artifactGroup;
  }

  /**
   * @returns {string} The identifier without he version or extension.
   */

  getVersionlessID() {
    return this.getGroup() + ':' + this.getID();
  }

  /**
   * @returns {string} The identifier without the extension.
   */

  getExtensionlessID() {
    return this.getIdentifier().split('@')[0];
  }

  /**
   * @returns {string} The version of this module's artifact.
   */

  getVersion() {
    return this.artifactVersion;
  }

  /**
   * @returns {string} The classifier of this module's artifact
   */

  getClassifier() {
    return this.artifactClassifier;
  }

  /**
   * @returns {string} The extension of this module's artifact.
   */

  getExtension() {
    return this.artifactExt;
  }

  /**
   * @returns {boolean} Whether or not this module has sub modules.
   */

  hasSubModules() {
    return this.subModules != null;
  }

  /**
   * @returns {Array.<Module>} An array of sub modules.
   */

  getSubModules() {
    return this.subModules;
  }

  /**
   * @returns {string} The type of the module.
   */

  getType() {
    return this.type;
  }
}
