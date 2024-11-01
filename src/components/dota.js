const { Component } = require('aghanim');
const enumMedal = require('../enums/medals');

module.exports = class Dota extends Component {
  constructor(client, options) {
    super(client);
    this.appID = 570;
    this.gameInfoUrl = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${this.appID}`;
  }
  gameInfo() {
    return this.client.httpClient
      .fetch('get', this.gameInfoUrl)
      .then((data) => ({
        currentplayers: data.response.player_count
      }));
  }
  getPlayerMedalRender(user, data) {
    const medal = enumMedal({
      rank: data.rank_tier,
      leaderboard: data.leaderboard_rank
    });
    return this.client.components.Locale.translateAsScopedUser(
      user,
      'interaction.player.medal',
      {
        medal:
          this.client.components.Locale.enhanceReplacements[
            `emoji_medal_${medal.medal}`
          ],
        range: medal.range ? `(${medal.range})` : '',
        leaderboard: medal.leaderboard ? `#${medal.leaderboard}` : ''
      }
    );
  }
  getPlayerFlagRender(data) {
    return typeof data.profile.loccountrycode === 'string'
      ? ':flag_' + data.profile.loccountrycode.toLowerCase() + ':'
      : '';
  }
};
