const { Component } = require('aghanim');
const FirebaseCollection = require('../classes/firebasecollection.js');
const FireSetCache = require('../classes/firesetcache');

module.exports = class Cache extends Component {
  constructor(client, options) {
    super(client);
    this.client.cache = {};
    this.channelChangelogID =
      process.env.DISCORD_PIT_SERVER_CHANNEL_CHANGELOG_ID;
  }
  ready() {
    this.update().then(() => {
      this.client.emit('cache:init');
    });
  }
  update() {
    return new Promise((res, rej) => {
      this.client.cache = {};
      this.updateFeeds();
      this.loadDota2Patch();
      if (this.client.isProduction || process.argv.includes('-db')) {
        this.client.db.once('value').then((snap) => {
          if (!snap.exists()) {
            this.client.logger.error('[cache]: error reloading');
            this.updateFake();
          } else {
            this.updateWithSnap(snap.val());
          }
          res();
        });
      } else {
        this.updateFake();
        res();
      }
    });
  }
  updateWithSnap(snap) {
    this.client.cache.profiles = new FirebaseCollection(
      snap.profiles,
      this.client.db.child('profiles')
    );
    this.client.cache.decks = new FirebaseCollection(
      snap.decks,
      this.client.db.child('decks')
    );
    this.client.cache.betatesters = new FireSetCache(
      this.client.db.child('betatesters'),
      [...(snap.betatesters ? Object.keys(snap.betatesters) : [])]
    );
    this.client.cache.supporters = new FireSetCache(
      this.client.db.child('supporters'),
      [...(snap.supporters ? Object.keys(snap.supporters) : [])]
    );
    this.client.logger.info('[cache]: loaded from database');
  }
  updateFake() {
    this.client.cache.profiles = new FirebaseCollection(
      {
        '189996884322942976': {
          lang: 'en',
          card: { bg: '1', pos: 'carry-es', heroes: '1,2,3' },
          dota: '112840925',
          steam: '76561198073106653'
        },
        '314083101129310208': {
          lang: 'en',
          card: { bg: '1', pos: 'all', heroes: '1,2,3' },
          dota: '120514623',
          steam: '76561198073106653'
        }
      },
      this.client.db.child('profiles')
    );
    this.client.cache.decks = new FirebaseCollection(
      this.client.db.child('decks')
    );
    this.client.cache.betatesters = new FireSetCache(
      this.client.db.child('betatesters')
    );
    this.client.cache.supporters = new FireSetCache(
      this.client.db.child('supporters')
    );
    this.client.logger.dev('[cache]: loaded fake data');
  }
  updateFeeds() {
    this.client.cache.feeds = new FirebaseCollection(
      this.client.db.child('feeds')
    );
    this.client.cache.feeds.on('value', function (snap) {
      if (snap.exists()) {
        this.clear();
        snap = snap.val();
        Object.keys(snap).forEach((key) => this.add(key, snap[key]));
      }
    });
    this.client.cache.feeds.order = function () {
      return this.sort(function (a, b) {
        a = parseInt(a._id);
        b = parseInt(b._id);
        return b - a;
      });
    };

    this.client.logger.ready('[cache]: feeds loaded');
  }
  loadDota2Patch() {
    return this.client.db
      .child('bot/patch')
      .once('value')
      .then((snap) => (this.client.cache.dota2Patch = snap.val()));
  }
};
