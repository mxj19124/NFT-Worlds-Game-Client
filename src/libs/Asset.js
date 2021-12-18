export default class Asset {
  /**
   * Create an asset.
   *
   * @param {any} id The id of the asset.
   * @param {string} hash The hash value of the asset.
   * @param {number} size The size in bytes of the asset.
   * @param {string} from The url where the asset can be found.
   * @param {string} to The absolute local file path of the asset.
   */

  constructor(id, hash, size, from, to) {
    this.id = id;
    this.hash = hash;
    this.size = size;
    this.from = from;
    this.to = to;
  }
}
