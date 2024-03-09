module.exports.Cache = class Cache {
  constructor(_logger, options = {}) {
    this._logger = _logger;
    this._serializeKey =
      options.serializeKey || ((param) => JSON.stringify(param));
    this._cache = new Map();
    this._ttl = options.ttl || 0;
  }
  has(key) {
    const serializeKey = this._serializeKey(key);
    this._logger.debug(`Checking if it has [${serializeKey}]`);
    const isCached = this._cache.has(serializeKey);
    const cache = isCached && this._cache.get(serializeKey);
    if (isCached && cache.expiresAt > 0 && cache.expiresAt < Date.now()) {
      this.remove(key);
      return false;
    }
    return isCached;
  }
  get(key) {
    if (this.has(key)) {
      return this._cache.get(this._serializeKey(key)).value;
    }
  }
  set(key, data, options = {}) {
    const serializeKey = this._serializeKey(key);
    this._logger.debug(`Setting [${serializeKey}]`);
    const ttl = options.ttl || this._ttl;
    return this._cache.set(serializeKey, {
      expiresAt: ttl > 0 ? Date.now() + ttl : -1,
      value: data
    });
  }
  remove(key) {
    const serializeKey = this._serializeKey(key);
    this._logger.debug(`Removing [${serializeKey}]`);
    return this._cache.delete(serializeKey);
  }
};
