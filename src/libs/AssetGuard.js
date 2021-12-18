import fs from 'fs-extra';
import path from 'path';
import childProcess from 'child_process';
import crypto from 'crypto';
import async from 'async';
import request from 'request';
import tar from 'tar-fs';
import zlib from 'zlib';
import AdmZip from 'adm-zip';
import EventEmitter from 'events';
import Asset from './Asset';
import DLTracker from './DLTracker';
import DistroModule from './DistroModule';
import DistroIndex from './DistroIndex';
import JavaGuard from './JavaGuard';
import Library from './Library';
import MinecraftUtil from './MinecraftUtil';
import Module from './distribution/Module';

const MODULE_TYPES = Module.getModuleTypes();

const distributionConfig = require('../assets/data/distribution.json');

export default class AssetGuard extends EventEmitter {
  /**
   * Create an instance of AssetGuard.
   * On creation the object's properties are never-null default
   * values. Each identifier is resolved to an empty DLTracker.
   *
   * @param {string} commonPath The common path for shared game files.
   * @param {string} javaexec The path to a java executable which will be used
   * to finalize installation.
   */

  constructor(commonPath, javaexec) {
    super();
    this.totaldlsize = 0;
    this.progress = 0;
    this.assets = new DLTracker([], 0);
    this.libraries = new DLTracker([], 0);
    this.files = new DLTracker([], 0);
    this.forge = new DLTracker([], 0);
    this.java = new DLTracker([], 0);
    this.extractQueue = [];
    this.commonPath = commonPath;
    this.javaexec = javaexec;
  }

  /**
   * Calculates the hash for a file using the specified algorithm.
   *
   * @param {Buffer} buf The buffer containing file data.
   * @param {string} algo The hash algorithm.
   * @returns {string} The calculated hash in hex.
   */

  static _calculateHash(buf, algo) {
    return crypto.createHash(algo).update(buf).digest('hex');
  }

  /**
   * Used to parse a checksums file. This is specifically designed for
   * the checksums.sha1 files found inside the forge scala dependencies.
   *
   * @param {string} content The string content of the checksums file.
   * @returns {Object} An object with keys being the file names, and values being the hashes.
   */

  static _parseChecksumsFile(content) {
    const finalContent = {};
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const bits = lines[i].split(' ');

      if (bits[1] == null) {
        continue;
      }

      finalContent[bits[1]] = bits[0];
    }

    return finalContent;
  }

  /**
   * Validate that a file exists and matches a given hash value.
   *
   * @param {string} filePath The path of the file to validate.
   * @param {string} algo The hash algorithm to check against.
   * @param {string} hash The existing hash to check against.
   * @returns {boolean} True if the file exists and calculated hash matches the given hash, otherwise false.
   */

  static _validateLocal(filePath, algo, hash) {
    if (fs.existsSync(filePath)) {
      // No hash provided, have to assume it's good.
      if (hash == null) {
        return true;
      }

      const buf = fs.readFileSync(filePath);
      const calcdhash = AssetGuard._calculateHash(buf, algo);
      return calcdhash === hash.toLowerCase();
    }

    return false;
  }

  /**
   * Validates a file in the style used by forge's version index.
   *
   * @param {string} filePath The path of the file to validate.
   * @param {Array.<string>} checksums The checksums listed in the forge version index.
   * @returns {boolean} True if the file exists and the hashes match, otherwise false.
   */

  static _validateForgeChecksum(filePath, checksums) {
    if (fs.existsSync(filePath)) {
      if (checksums == null || checksums.length === 0) {
        return true;
      }

      const buf = fs.readFileSync(filePath);
      const calcdhash = AssetGuard._calculateHash(buf, 'sha1');
      let valid = checksums.includes(calcdhash);

      if (!valid && filePath.endsWith('.jar')) {
        valid = AssetGuard._validateForgeJar(filePath, checksums);
      }

      return valid;
    }

    return false;
  }

  /**
   * Validates a forge jar file dependency who declares a checksums.sha1 file.
   * This can be an expensive task as it usually requires that we calculate thousands
   * of hashes.
   *
   * @param {Buffer} buf The buffer of the jar file.
   * @param {Array.<string>} checksums The checksums listed in the forge version index.
   * @returns {boolean} True if all hashes declared in the checksums.sha1 file match the actual hashes.
   */

  static _validateForgeJar(buf, checksums) {
    // Double pass method was the quickest I found. I tried a version where we store data
    // to only require a single pass, plus some quick cleanup but that seemed to take slightly more time.

    const hashes = {};
    let expected = {};

    const zip = new AdmZip(buf);
    const zipEntries = zip.getEntries();

    // First pass
    for (let i = 0; i < zipEntries.length; i++) {
      const entry = zipEntries[i];

      if (entry.entryName === 'checksums.sha1') {
        expected = AssetGuard._parseChecksumsFile(zip.readAsText(entry));
      }

      hashes[entry.entryName] = AssetGuard._calculateHash(entry.getData(), 'sha1');
    }

    if (!checksums.includes(hashes['checksums.sha1'])) {
      return false;
    }

    // Check against expected
    const expectedEntries = Object.keys(expected);

    for (let i = 0; i < expectedEntries.length; i++) {
      if (expected[expectedEntries[i]] !== hashes[expectedEntries[i]]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Extracts and unpacks a file from .pack.xz format.
   *
   * @param {Array.<string>} filePaths The paths of the files to be extracted and unpacked.
   * @returns {Promise.<void>} An empty promise to indicate the extraction has completed.
   */

  static _extractPackXZ(filePaths, javaExecutable) {
    console.log('[PackXZExtract] Starting');

    return new Promise((resolve, reject) => {
      let libPath;

      if (isDev) {
        libPath = path.join(process.cwd(), 'libraries', 'java', 'PackXZExtract.jar');
      } else {
        if (process.platform === 'darwin') {
          libPath = path.join(process.cwd(), 'Contents', 'Resources', 'libraries', 'java', 'PackXZExtract.jar');
        } else {
          libPath = path.join(process.cwd(), 'resources', 'libraries', 'java', 'PackXZExtract.jar');
        }
      }

      const filePath = filePaths.join(',');
      const child = childProcess.spawn(javaExecutable, [ '-jar', libPath, '-packxz', filePath ]);

      child.stdout.on('data', (data) => {
        console.log('[PackXZExtract]', data.toString('utf8'));
      });

      child.stderr.on('data', (data) => {
        console.log('[PackXZExtract]', data.toString('utf8'));
      });

      child.on('close', (code, signal) => {
        console.log('[PackXZExtract]', 'Exited with code', code);
        resolve();
      });
    });
  }

  /**
   * Function which finalizes the forge installation process. This creates a 'version'
   * instance for forge and saves its version.json file into that instance. If that
   * instance already exists, the contents of the version.json file are read and returned
   * in a promise.
   *
   * @param {Asset} asset The Asset object representing Forge.
   * @param {string} commonPath The common path for shared game files.
   * @returns {Promise.<Object>} A promise which resolves to the contents of forge's version.json.
   */

  static _finalizeForgeAsset(asset, commonPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(asset.to, (err, data) => {
        if (err) {
          console.log(err);
        }

        const zip = new AdmZip(data);
        const zipEntries = zip.getEntries();

        for (let i = 0; i < zipEntries.length; i++) {
          if (zipEntries[i].entryName === 'version.json') {
            const forgeVersion = JSON.parse(zip.readAsText(zipEntries[i]));
            const versionPath = path.join(commonPath, 'versions', forgeVersion.id);
            const versionFile = path.join(versionPath, forgeVersion.id + '.json');

            if (!fs.existsSync(versionFile)) {
              fs.ensureDirSync(versionPath);
              fs.writeFileSync(path.join(versionPath, forgeVersion.id + '.json'), zipEntries[i].getData());
              resolve(forgeVersion);
            } else {
              // Read the saved file to allow for user modifications.
              resolve(JSON.parse(fs.readFileSync(versionFile, 'utf-8')));
            }

            return;
          }
        }

        // We didn't find forge's version.json.
        reject(new Error('Unable to finalize Forge processing, version.json not found! Has forge changed their format?'));
      });
    });
  }

  /**
   * Loads the version data for a given minecraft version.
   *
   * @param {string} version The game version for which to load the index data.
   * @param {boolean} force Optional. If true, the version index will be downloaded even if it exists locally. Defaults to false.
   * @returns {Promise.<Object>} Promise which resolves to the version data object.
   */

  loadVersionData(version, force = false) {
    const self = this;

    return new Promise(async (resolve, reject) => {
      const versionPath = path.join(self.commonPath, 'versions', version);
      const versionFile = path.join(versionPath, version + '.json');

      if (!fs.existsSync(versionFile) || force) {
        const url = await self._getVersionDataUrl(version);

        // This download will never be tracked as it's essential and trivial.
        console.log('Preparing download of ' + version + ' assets.');

        fs.ensureDirSync(versionPath);

        const stream = request(url).pipe(fs.createWriteStream(versionFile));

        stream.on('finish', () => {
          resolve(JSON.parse(fs.readFileSync(versionFile)));
        });
      } else {
        resolve(JSON.parse(fs.readFileSync(versionFile)));
      }
    });
  }

  /**
   * Parses Mojang's version manifest and retrieves the url of the version
   * data index.
   *
   * @param {string} version The version to lookup.
   * @returns {Promise.<string>} Promise which resolves to the url of the version data index.
   * If the version could not be found, resolves to null.
   */

  _getVersionDataUrl(version) {
    return new Promise((resolve, reject) => {
      request('https://launchermeta.mojang.com/mc/game/version_manifest.json', (error, resp, body) => {
        if (error) {
          reject(error);
        } else {
          const manifest = JSON.parse(body);

          for (const v of manifest.versions) {
            if (v.id === version) {
              resolve(v.url);
            }
          }

          resolve(null);
        }
      });
    });
  }

  /**
   * Public asset validation function. This function will handle the validation of assets.
   * It will parse the asset index specified in the version data, analyzing each
   * asset entry. In this analysis it will check to see if the local file exists and is valid.
   * If not, it will be added to the download queue for the 'assets' identifier.
   *
   * @param {Object} versionData The version data for the assets.
   * @param {boolean} force Optional. If true, the asset index will be downloaded even if it exists locally. Defaults to false.
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  validateAssets(versionData, force = false) {
    const self = this;

    return new Promise((resolve, reject) => {
      self._assetChainIndexData(versionData, force).then(() => {
        resolve();
      });
    });
  }

  /**
   * Private function used to chain the asset validation process. This function retrieves
   * the index data.
   * @param {Object} versionData
   * @param {boolean} force
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  _assetChainIndexData(versionData, force = false) {
    const self = this;

    return new Promise((resolve, reject) => {
      // Asset index constants.
      const assetIndex = versionData.assetIndex;
      const name = assetIndex.id + '.json';
      const indexPath = path.join(self.commonPath, 'assets', 'indexes');
      const assetIndexLoc = path.join(indexPath, name);

      let data = null;

      if (!fs.existsSync(assetIndexLoc) || force) {
        console.log('Downloading ' + versionData.id + ' asset index.');
        fs.ensureDirSync(indexPath);

        const stream = request(assetIndex.url).pipe(fs.createWriteStream(assetIndexLoc));

        stream.on('finish', () => {
          data = JSON.parse(fs.readFileSync(assetIndexLoc, 'utf-8'));

          self._assetChainValidateAssets(versionData, data).then(() => {
            resolve();
          });
        });
      } else {
        data = JSON.parse(fs.readFileSync(assetIndexLoc, 'utf-8'));

        self._assetChainValidateAssets(versionData, data).then(() => {
          resolve();
        });
      }
    });
  }

  /**
   * Private function used to chain the asset validation process. This function processes
   * the assets and enqueues missing or invalid files.
   * @param {Object} versionData
   * @param {boolean} force
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  _assetChainValidateAssets(versionData, indexData) {
    const self = this;

    return new Promise((resolve, reject) => {
      // Asset constants
      const resourceURL = 'https://resources.download.minecraft.net/';
      const localPath = path.join(self.commonPath, 'assets');
      const objectPath = path.join(localPath, 'objects');

      const assetDlQueue = [];
      let dlSize = 0;
      let acc = 0;
      const total = Object.keys(indexData.objects).length;

      // const objKeys = Object.keys(data.objects)
      async.forEachOfLimit(indexData.objects, 10, (value, key, cb) => {
        acc++;
        self.emit('progress', 'assets', acc, total);
        const hash = value.hash;
        const assetName = path.join(hash.substring(0, 2), hash);
        const urlName = hash.substring(0, 2) + '/' + hash;
        const ast = new Asset(key, hash, value.size, resourceURL + urlName, path.join(objectPath, assetName));

        if (!AssetGuard._validateLocal(ast.to, 'sha1', ast.hash)) {
          dlSize += (ast.size * 1);
          assetDlQueue.push(ast);
        }

        cb();
      }, err => {
        if (err) {
          console.log(err);
        }

        self.assets = new DLTracker(assetDlQueue, dlSize);
        resolve();
      });
    });
  }

  /**
   * Public library validation function. This function will handle the validation of libraries.
   * It will parse the version data, analyzing each library entry. In this analysis, it will
   * check to see if the local file exists and is valid. If not, it will be added to the download
   * queue for the 'libraries' identifier.
   *
   * @param {Object} versionData The version data for the assets.
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  validateLibraries(versionData) {
    const self = this;

    return new Promise((resolve, reject) => {
      const libArr = versionData.libraries;
      const libPath = path.join(self.commonPath, 'libraries');
      const libDlQueue = [];
      let dlSize = 0;

      // Check validity of each library. If the hashs don't match, download the library.
      async.eachLimit(libArr, 5, (lib, cb) => {
        if (Library.validateRules(lib.rules, lib.natives)) {
          const artifact = (lib.natives == null)
            ? lib.downloads.artifact
            : lib.downloads.classifiers[lib.natives[Library.mojangFriendlyOS()].replace('${arch}', process.arch.replace('x', ''))];

          const libItm = new Library(
            lib.name,
            artifact.sha1,
            artifact.size,
            artifact.url,
            path.join(libPath, artifact.path),
          );

          if (!AssetGuard._validateLocal(libItm.to, 'sha1', libItm.hash)) {
            dlSize += (libItm.size * 1);
            libDlQueue.push(libItm);
          }
        }

        cb();
      }, (err) => {
        if (err) {
          console.log(err);
        }

        self.libraries = new DLTracker(libDlQueue, dlSize);

        resolve();
      });
    });
  }

  /**
   * Public miscellaneous mojang file validation function. These files will be enqueued under
   * the 'files' identifier.
   *
   * @param {Object} versionData The version data for the assets.
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  validateMiscellaneous(versionData) {
    const self = this;

    return new Promise(async (resolve, reject) => {
      await self.validateClient(versionData);
      await self.validateLogConfig(versionData);

      resolve();
    });
  }

  /**
   * Validate client file - artifact renamed from client.jar to '{version}'.jar.
   *
   * @param {Object} versionData The version data for the assets.
   * @param {boolean} force Optional. If true, the asset index will be downloaded even if it exists locally. Defaults to false.
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  validateClient(versionData, force = false) {
    const self = this;

    return new Promise((resolve, reject) => {
      const clientData = versionData.downloads.client;
      const version = versionData.id;
      const targetPath = path.join(self.commonPath, 'versions', version);
      const targetFile = version + '.jar';
      const client = new Asset(version + ' client', clientData.sha1, clientData.size, clientData.url, path.join(targetPath, targetFile));

      if (!AssetGuard._validateLocal(client.to, 'sha1', client.hash) || force) {
        self.files.dlqueue.push(client);
        self.files.dlsize += client.size * 1;

        resolve();
      } else {
        resolve();
      }
    });
  }

  /**
   * Validate log config.
   *
   * @param {Object} versionData The version data for the assets.
   * @param {boolean} force Optional. If true, the asset index will be downloaded even if it exists locally. Defaults to false.
   * @returns {Promise.<void>} An empty promise to indicate the async processing has completed.
   */

  validateLogConfig(versionData) {
    const self = this;

    return new Promise((resolve, reject) => {
      const client = versionData.logging.client;
      const file = client.file;
      const targetPath = path.join(self.commonPath, 'assets', 'log_configs');

      const logConfig = new Asset(file.id, file.sha1, file.size, file.url, path.join(targetPath, file.id));

      if (!AssetGuard._validateLocal(logConfig.to, 'sha1', logConfig.hash)) {
        self.files.dlqueue.push(logConfig);
        self.files.dlsize += logConfig.size * 1;

        resolve();
      } else {
        resolve();
      }
    });
  }

  /**
   * Validate the distribution.
   *
   * @param {Server} server The Server to validate.
   * @returns {Promise.<Object>} A promise which resolves to the server distribution object.
   */

  validateDistribution(server) {
    const self = this;

    return new Promise((resolve, reject) => {
      self.forge = self._parseDistroModules(server.getModules(), server.getMinecraftVersion(), server.getID());
      resolve(server);
    });
  }

  _parseDistroModules(modules, version, servid) {
    let alist = [];
    let asize = 0;

    for (const ob of modules) {
      const obArtifact = ob.getArtifact();
      const obPath = obArtifact.getPath();
      const artifact = new DistroModule(ob.getIdentifier(), obArtifact.getHash(), obArtifact.getSize(), obArtifact.getURL(), obPath, ob.getType());

      const validationPath = obPath.toLowerCase().endsWith('.pack.xz') ? obPath.substring(0, obPath.toLowerCase().lastIndexOf('.pack.xz')) : obPath;

      if (!AssetGuard._validateLocal(validationPath, 'MD5', artifact.hash)) {
        asize += artifact.size * 1;
        alist.push(artifact);

        if (validationPath !== obPath) this.extractQueue.push(obPath);
      }

      // Recursively process the submodules then combine the results.
      if (ob.getSubModules() != null) {
        const dltrack = this._parseDistroModules(ob.getSubModules(), version, servid);

        asize += dltrack.dlsize * 1;
        alist = alist.concat(dltrack.dlqueue);
      }
    }

    return new DLTracker(alist, asize);
  }

  /**
   * Loads Forge's version.json data into memory for the specified server id.
   *
   * @param {string} server The Server to load Forge data for.
   * @returns {Promise.<Object>} A promise which resolves to Forge's version.json data.
   */
  loadForgeData(server) {
    const self = this;

    return new Promise(async (resolve, reject) => {
      const modules = server.getModules();

      for (const ob of modules) {
        const type = ob.getType();

        if (type === MODULE_TYPES.ForgeHosted || type === MODULE_TYPES.Forge) {
          if (MinecraftUtil.isForgeGradle3(server.getMinecraftVersion(), ob.getVersion())) {
            // Read Manifest
            for (const sub of ob.getSubModules()) {
              if (sub.getType() === MODULE_TYPES.VersionManifest) {
                resolve(JSON.parse(fs.readFileSync(sub.getArtifact().getPath(), 'utf-8')));
                return;
              }
            }

            reject(new Error('No forge version manifest found!'));
            return;
          } else {
            const obArtifact = ob.getArtifact();
            const obPath = obArtifact.getPath();
            const asset = new DistroModule(ob.getIdentifier(), obArtifact.getHash(), obArtifact.getSize(), obArtifact.getURL(), obPath, type);

            try {
              const forgeData = await AssetGuard._finalizeForgeAsset(asset, self.commonPath);
              resolve(forgeData);
            } catch (err) {
              reject(err);
            }

            return;
          }
        }
      }

      reject(new Error('No forge module found!'));
    });
  }

  _parseForgeLibraries() {
    /* TODO
    * Forge asset validations are already implemented. When there's nothing much
    * to work on, implement forge downloads using forge's version.json. This is to
    * have the code on standby if we ever need it (since it's half implemented already).
    */
  }

  _enqueueOpenJDK(dataDir) {
    return new Promise((resolve, reject) => {
      JavaGuard._latestOpenJDK('8').then(verData => {
        if (verData != null) {
          dataDir = path.join(dataDir, 'runtime', 'x64');

          const fDir = path.join(dataDir, verData.name);
          const jre = new Asset(verData.name, null, verData.size, verData.uri, fDir);

          this.java = new DLTracker([ jre ], jre.size, (a, self) => {
            if (verData.name.endsWith('zip')) {
              const zip = new AdmZip(a.to);
              const pos = path.join(dataDir, zip.getEntries()[0].entryName);

              zip.extractAllToAsync(dataDir, true, (err) => {
                if (err) {
                  console.log(err);
                  self.emit('complete', 'java', JavaGuard.javaExecFromRoot(pos));
                } else {
                  fs.unlink(a.to, err => {
                    if (err) {
                      console.log(err);
                    }

                    self.emit('complete', 'java', JavaGuard.javaExecFromRoot(pos));
                  });
                }
              });
            } else {
              // Tar.gz
              let h = null;

              fs.createReadStream(a.to)
                .on('error', err => console.log(err))
                .pipe(zlib.createGunzip())
                .on('error', err => console.log(err))
                .pipe(tar.extract(dataDir, {
                  map: (header) => {
                    if (h == null) {
                      h = header.name;
                    }
                  },
                }))
                .on('error', err => console.log(err))
                .on('finish', () => {
                  fs.unlink(a.to, err => {
                    if (err) {
                      console.log(err);
                    }

                    if (h.indexOf('/') > -1) {
                      h = h.substring(0, h.indexOf('/'));
                    }

                    const pos = path.join(dataDir, h);

                    self.emit('complete', 'java', JavaGuard.javaExecFromRoot(pos));
                  });
                });
            }
          });

          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * Initiate an async download process for an AssetGuard DLTracker.
   *
   * @param {string} identifier The identifier of the AssetGuard DLTracker.
   * @param {number} limit Optional. The number of async processes to run in parallel.
   * @returns {boolean} True if the process began, otherwise false.
   */

  startAsyncProcess(identifier, limit = 5) {
    const self = this;
    const dlTracker = this[identifier];
    const dlQueue = dlTracker.dlqueue;

    if (dlQueue.length > 0) {
      console.log('DLQueue', dlQueue);

      async.eachLimit(dlQueue, limit, (asset, cb) => {
        fs.ensureDirSync(path.join(asset.to, '..'));

        const req = request(asset.from);
        req.pause();

        req.on('response', (resp) => {
          if (resp.statusCode === 200) {
            let doHashCheck = false;
            const contentLength = parseInt(resp.headers['content-length']);

            if (contentLength !== asset.size) {
              console.log(`WARN: Got ${contentLength} bytes for ${asset.id}: Expected ${asset.size}`);
              doHashCheck = true;

              // Adjust download
              this.totaldlsize -= asset.size;
              this.totaldlsize += contentLength;
            }

            const writeStream = fs.createWriteStream(asset.to);

            writeStream.on('close', () => {
              if (dlTracker.callback != null) {
                dlTracker.callback.apply(dlTracker, [ asset, self ]);
              }

              if (doHashCheck) {
                const v = AssetGuard._validateLocal(asset.to, asset.type != null ? 'md5' : 'sha1', asset.hash);

                if (v) {
                  console.log(`Hashes match for ${asset.id}, byte mismatch is an issue in the distro index.`);
                } else {
                  console.error(`Hashes do not match, ${asset.id} may be corrupted.`);
                }
              }

              cb();
            });

            req.pipe(writeStream);
            req.resume();
          } else {
            req.abort();
            console.log(`Failed to download ${asset.id}(${typeof asset.from === 'object' ? asset.from.url : asset.from}). Response code ${resp.statusCode}`);
            self.progress += asset.size * 1;
            self.emit('progress', 'download', self.progress, self.totaldlsize);
            cb();
          }
        });

        req.on('error', (err) => {
          self.emit('error', 'download', err);
        });

        req.on('data', (chunk) => {
          self.progress += chunk.length;
          self.emit('progress', 'download', self.progress, self.totaldlsize);
        });
      }, (err) => {
        if (err) {
          console.log('An item in ' + identifier + ' failed to process');
        } else {
          console.log('All ' + identifier + ' have been processed successfully');
        }

        // self.totaldlsize -= dlTracker.dlsize
        // self.progress -= dlTracker.dlsize
        self[identifier] = new DLTracker([], 0);

        if (self.progress >= self.totaldlsize) {
          if (self.extractQueue.length > 0) {
            self.emit('progress', 'extract', 1, 1);
            // self.emit('extracting')
            AssetGuard._extractPackXZ(self.extractQueue, self.javaexec).then(() => {
              self.extractQueue = [];
              self.emit('complete', 'download');
            });
          } else {
            self.emit('complete', 'download');
          }
        }
      });

      return true;
    } else {
      return false;
    }
  }

  /**
   * This function will initiate the download processed for the specified identifiers. If no argument is
   * given, all identifiers will be initiated. Note that in order for files to be processed you need to run
   * the processing function corresponding to that identifier. If you run this function without processing
   * the files, it is likely nothing will be enqueued in the object and processing will complete
   * immediately. Once all downloads are complete, this function will fire the 'complete' event on the
   * global object instance.
   *
   * @param {Array.<{id: string, limit: number}>} identifiers Optional. The identifiers to process and corresponding parallel async task limit.
   */

  processDlQueues(identifiers = [ { id: 'assets', limit: 20 }, { id: 'libraries', limit: 5 }, { id: 'files', limit: 5 }, { id: 'forge', limit: 5 } ]) {
    return new Promise((resolve, reject) => {
      let shouldFire = true;

      // Assign dltracking variables.
      this.totaldlsize = 0;
      this.progress = 0;

      for (const iden of identifiers) {
        this.totaldlsize += this[iden.id].dlsize;
      }

      this.once('complete', (data) => {
        resolve();
      });

      for (const iden of identifiers) {
        const r = this.startAsyncProcess(iden.id, iden.limit);
        if (r) shouldFire = false;
      }

      if (shouldFire) {
        this.emit('complete', 'download');
      }
    });
  }

  async validateOrDownloadEverything(serverid, dev = false) {
    try {
      const distroIndex = await DistroIndex.fromJSON(distributionConfig);
      const server = distroIndex.getServer(serverid);

      // Validate Everything
      await this.validateDistribution(server);
      this.emit('validate', 'distribution');
      const versionData = await this.loadVersionData(server.getMinecraftVersion());
      this.emit('validate', 'version');
      await this.validateAssets(versionData);
      this.emit('validate', 'assets');
      await this.validateLibraries(versionData);
      this.emit('validate', 'libraries');
      await this.validateMiscellaneous(versionData);
      this.emit('validate', 'files');
      await this.processDlQueues();
      this.emit('complete', 'download');

      const forgeData = await this.loadForgeData(server);

      return {
        versionData,
        forgeData,
      };
    } catch (err) {
      return {
        versionData: null,
        forgeData: null,
        error: err,
      };
    }
  }
}
