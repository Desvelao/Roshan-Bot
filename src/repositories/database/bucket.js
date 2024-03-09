module.exports.DatabaseBucket = class DatabaseBucket {
  constructor(key, logger, database) {
    this._key = key;
    this.logger = logger;
    this._database = database;
    this.logger.info(`Created bucket [${this._key}]`);
  }
  _getRef(key) {
    const refKey = key ? `${this._key}/${key}` : this._key;
    this.logger.debug(`Getting reference for [${key}]: [${refKey}]`);
    return this._database.db.child(refKey);
  }
  async get(key) {
    try {
      this.logger.debug(`Getting data [${key}]`);
      const response = await this._getRef(key).once('value');
      if (!response.exists()) {
        throw new Error('No data found');
      }
      const value = await response.val();
      this.logger.debug(`Value for [${key}] [${JSON.stringify(value)}]`);
      return key ? value[key] : value;
    } catch (error) {
      this.logger.error(`Error getting data: ${error.message}`);
      throw error;
    }
  }
  _getKeyData(key, data) {
    const result = {
      data: data,
      key: key
    };
    return result;
  }
  async set(key, data) {
    try {
      const update = this._getKeyData(key, data);
      this.logger.debug(
        `Setting data for [${update.key}]: [${JSON.stringify(update.data)}]`
      );
      const response = await this._getRef(update.key).set(update.data);
      // Validate the response data instead of return the input
      return update.data;
    } catch (error) {
      this.logger.error(`Error setting data: ${error.message}`);
      throw error;
    }
  }

  async update(key, data) {
    try {
      const update = this._getKeyData(key, data);
      this.logger.debug(
        `Updating data for [${update.key}]: [${JSON.stringify(update.data)}]`
      );
      const response = this._getRef(update.key).update(update.data);
      // Validate the response data instead of return the input
      return update.data;
    } catch (error) {
      tthis.logger.error(`Error updating data: ${error.message}`);
      throw error;
    }
  }

  async remove(key) {
    try {
      const update = this._getKeyData(key);
      this.logger.debug(`Removing key [${update.key}]`);
      const response = this._getRef(update.key).remove();
      // Validate the response data instead of return the input
      return update.data;
    } catch (error) {
      this.logger.error(`Error deleting data: ${error.message}`);
      throw error;
    }
  }
};
