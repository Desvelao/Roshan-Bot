const axios = require('axios');
const { Cache } = require('./cache');

module.exports.HttpClient = class HttpClient {
  constructor(_logger, options) {
    this._logger = _logger;
    this._cache =
      options.cache && options.cache.ttl
        ? new Cache(this._logger, { ttl: options.cache.ttl })
        : null;
  }
  async fetch(method, url, options = {}) {
    const cacheKey = { method, url };
    if (this._cache) {
      if (this._cache.has(cacheKey)) {
        this._logger.debug('Key found. Using cache.');
        return this._cache.get(cacheKey);
      }
    }
    this._logger.debug('Key not found. Fetching data.');
    const response = await axios[method](url);
    if (this._cache) {
      this._cache.set(cacheKey, response.data);
    }
    return response.data;
  }
};
