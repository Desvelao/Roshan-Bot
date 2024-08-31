module.exports.ProfilesManager = class ProfilesManager {
  constructor(_logger, _collection) {
    this._logger = _logger;
    this._collection = _collection;
  }
  getAccountSchema() {
    return {
      lang: 'en',
      card: {
        bg: '0',
        heroes: '1,2,3',
        pos: 'all'
      },
      dota: '',
      steam: ''
    };
  }
  hasAccountData(_id) {
    return this._collection._cache.has(_id);
  }
  getUserAccountData(_id) {
    return this._collection._cache.get(_id);
  }
  async createUserAccount(_id, data) {
    try {
      this._logger.debug(`Creating user account [${_id}]`);
      await this._collection.set(_id, data);
      this._logger.info(`Created user account [${_id}]`);
    } catch (error) {
      this._logger.error(`Error creating user account: [${error.message}]`);
      throw error;
    }
  }
  async updateUserAccount(_id, data) {
    try {
      if (!this.hasAccountData(_id)) {
        throw new Error('Account data does not exist.');
      }
      this._logger.debug(`Updating user account [${_id}]`);
      await this._collection.update(_id, data);
      this._logger.info(`Updated user account [${_id}]`);
    } catch (error) {
      this._logger.error(`Error updating user account: [${error.message}]`);
      throw error;
    }
  }
  async removeUserAccount(_id) {
    try {
      this._logger.debug(`Removing user account [${_id}]`);
      await await this._collection.remove(_id);
      this._logger.debug(`Removed user account [${_id}]`);
    } catch (error) {
      this._logger.error(`Error removing user account: [${error.message}]`);
      throw error;
    }
  }
  getUserProfile(_id) {
    return {
      account: this.getUserAccountData(_id),
      supporter: false, // TODO:
      betatester: false, // TODO:
      registered: this.hasAccountData(_id)
    };
  }
  find(fn) {
    return [...this._collection._cache.values()].find(fn);
  }
  filter(fn) {
    return [...this._collection._cache.values()].filter(fn);
  }
};
