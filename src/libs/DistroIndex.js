import Server from './distribution/Server';

export default class DistroIndex {
  /**
   * Parse a JSON object into a DistroIndex.
   *
   * @param {Object} json A JSON object representing a DistroIndex.
   *
   * @returns {DistroIndex} The parsed Server object.
   */

  static fromJSON(json) {
    const servers = json.servers;
    json.servers = [];

    const distro = Object.assign(new DistroIndex(), json);
    distro._resolveServers(servers);
    distro._resolveMainServer();

    return distro;
  }

  _resolveServers(json) {
    const arr = [];

    for (const s of json) {
      arr.push(Server.fromJSON(s));
    }

    this.servers = arr;
  }

  _resolveMainServer() {
    for (const serv of this.servers) {
      if (serv.mainServer) {
        this.mainServer = serv.id;
        return;
      }
    }

    // If no server declares default_selected, default to the first one declared.
    this.mainServer = (this.servers.length > 0) ? this.servers[0].getID() : null;
  }

  /**
   * @returns {string} The version of the distribution index.
   */

  getVersion() {
    return this.version;
  }

  /**
   * @returns {string} The URL to the news RSS feed.
   */

  getRSS() {
    return this.rss;
  }

  /**
   * @returns {Array.<Server>} An array of declared server configurations.
   */

  getServers() {
    return this.servers;
  }

  /**
   * Get a server configuration by its ID. If it does not
   * exist, null will be returned.
   *
   * @param {string} id The ID of the server.
   *
   * @returns {Server} The server configuration with the given ID or null.
   */

  getServer(id) {
    for (const serv of this.servers) {
      if (serv.id === id) {
        return serv;
      }
    }

    return null;
  }

  /**
   * Get the main server.
   *
   * @returns {Server} The main server.
   */

  getMainServer() {
    return this.mainServer != null ? this.getServer(this.mainServer) : null;
  }
}
