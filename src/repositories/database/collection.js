function mergeObject(base, merge) {
  base = base !== undefined ? base : {};
  for (let el in merge) {
    if (typeof merge[el] === 'object') {
      base[el] = mergeObject(base[el], merge[el]);
    } else {
      base[el] = merge[el];
    }
  }
  return Object.assign({}, base);
}

module.exports.DatabaseCollection = class DatabaseCollection {
  constructor(name, logger, bucket, model) {
    this._name = name;
    this._logger = logger;
    this._bucket = bucket;
    this._model =
      model ||
      function (params, id) {
        return { ...params, _id: id };
      };
    this._initCache();
  }
  _initCache() {
    this._cache = new Map();
  }
  async _fetch() {
    this._initCache();
    const data = await this._bucket.get();
    if (data) {
      this._logger.debug('Data found. Set into cache');
      Object.keys(data).forEach((key) => {
        this._cache.set(key, this._model(data[key], key));
        this._logger.debug(`Key cached [${key}]`);
      });
    }
  }
  async init() {
    try {
      this._logger.debug('Initiating');
      await this._fetch();
    } catch (error) {
      this._logger.error(error.message);
    }
  }
  async reload() {
    try {
      this._logger.debug('Reloading');
      await this._fetch();
    } catch (error) {
      this._logger.error(error.message);
    }
  }
  async get(id) {
    this._logger.debug(`Get item [${id}]`);
    if (this._cache.has(id)) {
      this._logger.debug(`Key is cached [${id}]`);
      return this._cache.get(id);
    }
    const data = await this._bucket.get(id);
    const enhancedData = this._model(data, id);
    this._cache.set(id, enhancedData);
    this._logger.debug(`Key cached [${id}] [${JSON.stringify(enhancedData)}]`);
    return enhancedData;
  }
  async set(id, data) {
    const enhancedData = this._model(data, id);
    await this._bucket.set(id, enhancedData);
    this._cache.set(id, enhancedData);
    this._logger.debug(`Key cached [${id}]`);
  }
  async update(id, data) {
    const enhancedData = this._model(
      this._cache.has(id) ? { ...this._cache.get(id), ...data } : data,
      id
    );
    await this._bucket.update(id, enhancedData);
    this._cache.set(id, enhancedData);
    this._logger.debug(`Key cached [${id}]`);
  }
  async remove(id) {
    await this._bucket.remove(id);
    this._cache.delete(id);
    this._logger.debug(`Key removed [${id}]`);
  }
};
