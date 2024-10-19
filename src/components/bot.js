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

        if (this.client.config.switches.backupdb) {
          //config.switches.backupdb
          util.Firebase.backupDBfile(
            this.client.db,
            this.client,
            process.env.DISCORD_PIT_SERVER_CHANNEL_BACKUP_ID,
            {
              filenameprefix: 'roshan_db_',
              messageprefix: '**Roshan Backup DB**'
            }
          ).then((data) => {
            this.client.logger.info('Backup', 'Done!');

            //Update leaderboard (Firebase) each this.client.config.hoursLeaderboardUpdate at least
            if (
              this.client.config.switches.leaderboardUpdate &&
              this.client.config.constants.hoursLeaderboardUpdate * 3600 +
                data.leaderboard.updated <
                new Date().getTime() / 1000
            ) {
              this.updateLeaderboard(snap.profiles);
            }

            // Update public data
            this.client.database
              .getBucket('public')
              .update({
                discord_invite: process.env.DISCORD_PIT_SERVER_INVITE_URL,
                discord_server: process.env.DISCORD_PIT_SERVER_URL,
                users: Object.keys(data.profiles).length,
                servers: Object.keys(data.servers).length,
                version: packageInfo.version
              })
              .then(() => this.client.logger.info('Publicinfo updated'));
          });
        }
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
      this.client.editStatus(this.client.config.status, {
        name: this.client.config.status_msg,
        type: this.client.config.status_act,
        url: this.client.config.status_url
      })
    );
    return Promise.all(promises);
  }
  updateLeaderboard(snap) {
    if (snap) {
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
                    this.client.components.Opendota.player_steam(
                      player.dota_id
                    ).then((dataArray) => {
                      const [data] = dataArray;
                      player.data = data;
                      res([...results, player]);
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
          return this.client.database
            .set('leaderboard', update)
            .then(() => this.client.logger.info('Ranking Updated'));
        });
    }
  }
  parseText(text, mode) {
    if (typeof text != 'string') {
      return 'Unknown';
    }
    let newText = text;
    if (mode == 'nf') {
      newText = text.replace(new RegExp('`', 'g'), "'");
    }
    return newText;
  }
};
