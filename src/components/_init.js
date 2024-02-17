const { Component, Eris } = require('aghanim');
const { Color } = require('erisjs-utils');

module.exports = class Init extends Component {
  constructor(client, options) {
    super(client);
    let CONFIG = require('../config.json');
    // transform the hex colors to number
    for (let cat in CONFIG.colors) {
      if (typeof CONFIG.colors[cat] == 'string') {
        CONFIG.colors[cat] = Color.convert(CONFIG.colors[cat], 'hex-int');
        continue;
      }
      for (let c in CONFIG.colors[cat]) {
        CONFIG.colors[cat][c] = Color.convert(CONFIG.colors[cat][c], 'hex-int');
      }
    }

    // store the configuration in the client
    this.client.config = CONFIG;

    /**
     * get the guild members with the role
     * @param {string} roleName
     * @returns
     */
    Eris.Guild.prototype.membersWithRole = function (roleName) {
      const role = this.roles.find((r) => r.name === roleName);
      return role ? this.members.filter((m) => m.roles.includes(role.id)) : [];
    };

    /**
     * add a success reaction to the message
     * @returns
     */
    Eris.Message.prototype.addReactionSuccess = function () {
      return this.addReaction(this._client.config.emojis.default.accept);
    };
  }
  ready() {
    // store the Pit server in the client instance
    this.client.server = this.client.guilds.get(
      process.env.DISCORD_PIT_SERVER_ID
    );
  }
};
