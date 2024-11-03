const util = require('erisjs-utils');
const packageInfo = require('../../package.json');
const odutil = require('../helpers/opendota-utils');
const { Cache } = require('../repositories/cache');
const { Logger, Component } = require('aghanim');

module.exports = class Bot extends Component {
  constructor(client, options) {
    super(client);
    this.client.cacheManager = new Cache(
      new Logger({
        label: 'Cache',
        timestamps: true,
        ignoredLevels: [this.client.isProduction ? 'debug' : '']
      })
    );
    this.client.once('database:init', () => {
      this._ready();
    });
  }
  _ready() {
    this.client.database
      .getBucket('bot')
      .get()
      .then((data) => {
        this.client.cacheManager.set('dota2Patch', data.patch);
        this.client.config.switches = data.switches;
        if (!this.client.isProduction) {
          this.client.config.switches.leaderboardUpdate = false;
          this.client.config.switches.backupdb = false;
          this.client.config.switches.publicDataUpdate = false;
        }
        //flags DEVMODE
        if (!this.client.isProduction && process.argv.includes('-db')) {
          this.client.config.switches.backupdb = true;
          this.client.logger.dev('DB active');
        }
        if (!this.client.isProduction && process.argv.includes('-ul')) {
          this.client.config.switches.leaderboardUpdate = true;
          this.client.logger.dev('DB active - UPDATE Leaderboard');
        }

        this.client.config.playing = data.playing;
        this.client.config.status = data.status;
        this.client.config.status_act = data.status_act;
        this.client.config.status_url = data.status_url;
        this.client.config.status_msg = data.status_msg;

        this.setStatus(
          this.client.config.status_act,
          this.client.config.status,
          this.client.config.status_msg,
          this.client.config.status_url,
          false
        ).then(() => this.client.logger.ready('Status set'));
      });
  }
  setStatus(type, status, msg, url, update) {
    this.client.config.status =
      status !== null ? status : this.client.config.status;
    this.client.config.status_act =
      type !== null ? type : this.client.config.status_act;
    this.client.config.status_msg =
      msg !== null ? msg : this.client.config.status_msg;
    this.client.config.status_url =
      url !== null ? url : this.client.config.status_url;
    let promises = [];
    if (update) {
      promises.push(
        this.client.database.getBucket('bot').update({
          status: this.client.config.status,
          status_act: this.client.config.status_act,
          status_msg: this.client.config.status_msg,
          status_url: this.client.config.status_url
        })
      );
    }
    promises.push(
      // TODO: update to eris 0.18.0 to use custom status (type 4) https://abal.moe/Eris/docs/0.18.0/Client#method-editStatus
      this.client.editStatus(this.client.config.status, {
        // name: this.client.config.status_msg,
        name: 'Alpha',
        type: this.client.config.status_act,
        url: this.client.config.status_url
      })
    );
    return Promise.all(promises);
  }
  async updateLeaderboard() {
    try {
      this.client.logger.debug('Updating leaderboard');
      const profiles = await this.client.database.getBucket('profiles').get();
      const data = await this._updateLeaderboardGetPlayersData(profiles);
      this.client.logger.debug(`Leaderboard data: ${JSON.stringify(data)}`);
      await this.client.database.getBucket('leaderboard').set(undefined, data);
      this.client.logger.debug('Updated leaderboard');
    } catch (error) {
      this.client.logger.error(`Error updating leaderboard: ${error.message}`);
    }
  }
  _updateLeaderboardGetPlayersData(snap) {
    return Object.keys(snap)
      .map((p) => ({ discord_id: p, dota_id: snap[p].dota }))
      .filter((player) => player.dota_id)
      .map((player) => {
        const guild = this.client.guilds.find((g) =>
          g.members.get(player.discord_id)
        );
        let member;
        if (guild) {
          member = guild.members.get(player.discord_id);
        }
        player.username = member ? member.username : false;
        player.avatar = member ? member.avatarURL : false;
        return player;
      })
      .reduce((promise, player) => {
        return promise.then(
          (results) =>
            new Promise((res) => {
              setTimeout(
                () =>
                  this.client.components.Opendota.player_steam(player.dota_id)
                    .then((dataArray) => {
                      const [data] = dataArray;
                      player.data = data;
                      res([...results, player]);
                    })
                    .catch((e) => {
                      this.client.logger.error(
                        `Error getting data of player [${player.dota_id}]: ${e.message}`
                      );
                      res([...results, { data: null }]);
                    }),
                2000
              );
            })
        );
      }, Promise.resolve([]))
      .then((players) => {
        const update = players.reduce(
          (update, player) => {
            const { data } = player;
            if (!data) {
              return update;
            }
            const rank = odutil.getMedal(data, 'raw');
            update.ranking[player.discord_id] = {
              username: player.username || data.profile.personaname,
              nick: data.profile.personaname || '',
              avatar: player.avatar || data.profile.avatarmedium,
              rank: rank.rank,
              leaderboard: rank.leaderboard
            };
            return update;
          },
          { updated: Math.round(Date.now() / 1000), ranking: {} }
        );
        return update;
      });
  }
  async updatePublicData() {
    try {
      this.client.logger.debug('Updating public data');
      const profiles = await this.client.database.getBucket('profiles').get();
      const publicData = {
        discord_invite: process.env.DISCORD_PIT_SERVER_INVITE_URL,
        discord_server: process.env.DISCORD_PIT_SERVER_URL,
        users: Object.keys(profiles).length,
        servers: 0, // TODO: remove
        version: packageInfo.version
      };
      this.client.logger.debug(`Public data: ${JSON.stringify(publicData)}`);
      await this.client.database
        .getBucket('public')
        .update(undefined, publicData);
      this.client.logger.info('Updated public data');
    } catch (error) {
      this.client.logger.error(`Error updating public data: ${error.message}`);
    }
  }
  async takeDatabaseBackup() {
    try {
      this.client.logger.debug('Taking database backup');
      await util.Firebase.backupDBfile(
        this.client.db,
        this.client,
        process.env.DISCORD_PIT_SERVER_CHANNEL_BACKUP_ID,
        {
          filenameprefix: 'roshan_db_',
          messageprefix: '**Roshan Backup DB**'
        }
      );
      this.client.logger.debug('Database backup finished');
    } catch (error) {
      this.client.logger.error(
        `Error taking database backup: ${error.message}`
      );
    }
  }
};
