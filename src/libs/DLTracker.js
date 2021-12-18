/**
 * Class representing a download tracker. This is used to store meta data
 * about a download queue, including the queue itself.
 */
export default class DLTracker {
  /**
   * Create a DLTracker
   *
   * @param {Array.<Asset>} dlqueue An array containing assets queued for download.
   * @param {number} dlsize The combined size of each asset in the download queue array.
   * @param {function(Asset)} callback Optional callback which is called when an asset finishes downloading.
   */

  constructor(dlqueue, dlsize, callback = null) {
    this.dlqueue = dlqueue;
    this.dlsize = dlsize;
    this.callback = callback;
  }
}
