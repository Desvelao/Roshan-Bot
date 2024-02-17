const { Component } = require('aghanim');
const axios = require('axios');

module.exports = class Dota extends Component {
  constructor(client, options) {
    super(client);
    this.appID = 570;
    this.gameInfoUrl = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${this.appID}`;
  }
  gameInfo() {
    return axios.get(this.gameInfoUrl).then((data) => ({
      currentplayers: data.data.response.player_count
    }));
  }
};
