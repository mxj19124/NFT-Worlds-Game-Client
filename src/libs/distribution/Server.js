import Module from './Module';

export default class Server {
  /**
   * Parse a JSON object into a Server.
   *
   * @param {Object} json A JSON object representing a Server.
   *
   * @returns {Server} The parsed Server object.
   */

  static fromJSON(json) {
    const mdls = json.modules;
    json.modules = [];

    const serv = Object.assign(new Server(), json);
    serv._resolveModules(mdls);

    return serv;
  }

  _resolveModules(json) {
    const arr = [];

    for (const m of json) {
      arr.push(Module.fromJSON(m, this.getID()));
    }

    this.modules = arr;
  }

  /**
   * @returns {string} The ID of the server.
   */

  getID() {
    return this.id;
  }

  /**
   * @returns {string} The name of the server.
   */

  getName() {
    return this.name;
  }

  /**
   * @returns {string} The description of the server.
   */

  getDescription() {
    return this.description;
  }

  /**
   * @returns {string} The URL of the server's icon.
   */

  getIcon() {
    return this.icon;
  }

  /**
   * @returns {string} The version of the server configuration.
   */

  getVersion() {
    return this.version;
  }

  /**
   * @returns {string} The IP address of the server.
   */

  getAddress() {
    return this.address;
  }

  /**
   * @returns {string} The minecraft version of the server.
   */

  getMinecraftVersion() {
    return this.minecraftVersion;
  }

  /**
   * @returns {boolean} Whether or not this server is the main
   * server. The main server is selected by the launcher when
   * no valid server is selected.
   */

  isMainServer() {
    return this.mainServer;
  }

  /**
   * @returns {boolean} Whether or not the server is autoconnect.
   * by default.
   */

  isAutoConnect() {
    return this.autoconnect;
  }

  /**
   * @returns {Array.<Module>} An array of modules for this server.
   */

  getModules() {
    return this.modules;
  }
}
