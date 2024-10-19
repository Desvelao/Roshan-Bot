const { Component, Eris, Logger } = require('aghanim');
const { Database } = require('../repositories/database/database');
const firebase = require('firebase-admin');
const { ProfilesManager } = require('../domain/profiles-manager');
const { HttpClient } = require('../repositories/http');
const { convertHexInt } = require('../helpers/colors');

module.exports = class Init extends Component {
  constructor(client, options) {
    super(client);

    this._loadConfiguration();

    /**
     * add a success reaction to the message
     * @returns
     */
    Eris.Message.prototype.addReactionSuccess = function () {
      return this.addReaction(this._client.config.emojis.default.accept);
    };

    this._initDatabase();
  }
  _loadConfiguration() {
    let CONFIG = require('../config.json');
    // transform the hex colors to number
    for (let cat in CONFIG.colors) {
      if (typeof CONFIG.colors[cat] == 'string') {
        CONFIG.colors[cat] = convertHexInt(CONFIG.colors[cat]);
        continue;
      }
      for (let c in CONFIG.colors[cat]) {
        CONFIG.colors[cat][c] = convertHexInt(CONFIG.colors[cat][c]);
      }
    }

    // store the configuration in the client
    this.client.config = CONFIG;
  }
  _initDatabase() {
    // Start database
    const client = this.client;
    function getLogger(label = '') {
      const logger = new Logger({
        label: `Database [${label}]`,
        timestamps: true,
        ignoredLevels: [client.isProduction ? 'debug' : '']
      });
      return {
        ...logger,
        getLogger(childLoggerLabel) {
          return getLogger(`${label}/${childLoggerLabel}`);
        }
      };
    }

    const database = new Database(getLogger());
    database.connect().then(() => {
      this.client.firebase = firebase;
      this.client.storage = firebase.storage().bucket();
      this.client.db = firebase.database().ref();

      // database.createBucket('leaderboards');
      database.createBucket('bot');
      database.createBucket('botstats');
      database.createBucket('public');
      Promise.all(
        [
          database.createCollection('servers'),
          database.createCollection('test-profiles', function (params, _id) {
            // TODO: create the object database model with default values
            return {
              dota: params.dota,
              lang: params.lang || 'en',
              steam: params.steam || '',
              card: params.card || {
                bg: '0',
                heroes: '1,2,3',
                pos: 'all'
              },
              _id
            };
          })
        ].map((databaseCollection) => databaseCollection.init().catch(() => {}))
      ).then(() => {
        this.client.emit('database:init');
        // Init the profiles manager
        this.client.profilesManager = new ProfilesManager(
          new Logger({
            label: 'ProfilesManager',
            timestamps: true,
            ignoredLevels: [this.client.isProduction ? 'debug' : '']
          }),
          database.getCollection('test-profiles')
        );
      });
    });

    this.client.database = database;
    this.client.httpClient = new HttpClient(
      new Logger({
        label: 'HTTP-Client',
        timestamps: true,
        ignoredLevels: [this.client.isProduction ? 'debug' : '']
      }),
      { cache: { ttl: 60000 } } // TTL 60 seconds
    );
  }
  ready() {
    // store the Pit server in the client instance
    this.client.server = this.client.guilds.get(
      process.env.DISCORD_PIT_SERVER_ID
    );
  }
};
