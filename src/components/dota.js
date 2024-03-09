const { Component } = require('aghanim');

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
};
