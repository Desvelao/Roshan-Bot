const { Component } = require('aghanim');
const axios = require('axios');

module.exports = class WorldRankingApi extends Component {
  constructor(client, options) {
    super(client);
    this.divisions = ['europe', 'americas', 'china', 'seasia'];
    this.defaultDivision = this.divisions[0];
    this.urls = {
      base: 'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=',
      americas: 'americas',
      china: 'china',
      seasia: 'se_asia',
      europe: 'europe'
    };
  }
  url(division) {
    return this.urls.base + this.urls[division] + '&leaderboard=0';
  }
  get(division) {
    return axios.get(this.url(division)).then(({ data }) => data);
  }
  searchPlayerInWorld(query) {
    return new Promise((resolve, reject) => {
      this.promises()
        .then((r) => {
          const where = r
            .map((d, i) => {
              const ix = d.leaderboard.findIndex(
                (p) => p.name.toLowerCase() === query.toLowerCase()
              );
              if (ix > -1) {
                return {
                  pos: ix + 1,
                  player: d.leaderboard[ix],
                  division: this.divisions[i]
                };
              }
            })
            .filter((p) => p);
          if (where.length) {
            resolve(where);
          } else {
            reject(`Player not found with name: ${query}`);
          }
        })
        .catch((err) => reject(err));
    });
  }
  promises() {
    return Promise.all(this.divisions.map((division) => this.get(division)));
  }
};
