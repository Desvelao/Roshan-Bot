const { Eris, Component } = require('aghanim');
const odutil = require('../helpers/opendota-utils');
const { Markdown } = require('erisjs-utils');

module.exports = class Account extends Component {
  constructor(client, options) {
    super(client);

    // Define custom requirements
    this.client.addCommandRequirement({
      type: 'account.exist',
      validate: async (context, client, command, req) => {
        const account = await client.profilesManager.getUserAccountData(
          context.user.id
        );
        if (!account) {
          return false;
        }
        !context.ctx && (context.ctx = {});
        context.ctx.account = account;
        return true;
      },
      response: (context, client, command, req) =>
        client.components.Locale.replyInteraction(context, 'bot.needregister')
    });

    this.client.addCommandRequirement({
      type: 'account.existany',
      validate: async (context, client, command, req) => {
        !context.ctx && (context.ctx = {});
        const userID =
          context.data.options && context.data.options.length
            ? (
                context.data.options.find(
                  (option) => option.name === 'user_mention'
                ) || {}
              ).value ||
              (
                context.data.options.find(
                  (option) => option.name === 'user_id'
                ) || {}
              ).value
            : context.user.id;

        context.ctx.account = await client.profilesManager.getUserAccountData(
          userID
        );
        context.ctx.user = client.users.get(userID);
        if (!context.ctx.account) {
          if (userID === context.user.id) {
            await client.components.Locale.replyInteraction(
              context,
              'bot.needregister'
            );
            return true;
          }
          return false;
        }
        return true;
      },
      response: "Your account doesn't exist"
    });

    this.client.addCommandRequirement({
      type: 'account.registered',
      validate: async (context, client, command, req) => {
        return client.profilesManager.getUserProfile(context.user.id)
          .registered;
      },
      response: (context, client, command, req) =>
        client.components.Locale.replyInteraction(context, 'bot.needregister')
    });

    this.client.addCommandRequirement({
      type: 'account.not.registered',
      validate: async (context, client, command, req) => {
        return !client.profilesManager.getUserProfile(context.user.id)
          .registered;
      },
      response: (context, client, command, req) =>
        client.components.Locale.replyInteraction(
          context,
          'register.alreadyregistered'
        )
    });

    this.client.addCommandRequirement({
      type: 'account.supporter',
      validate: async (context, client, command, req) => {
        return client.profilesManager.getUserProfile(context.user.id).supporter;
      },
      response: (context, client, command, req) =>
        client.components.Locale.replyInteraction(
          context,
          'roshan.supporter.need'
        )
    });

    this.client.on('profile:register', ({ profile }) => {
      this.client.logger.info(`New account: (${profile.id})`);
    });

    this.client.on('profile:unregister', ({ profile }) => {
      this.client.logger.info(`Delete account: (${profile.id})`);
    });
  }
  updateAccountLeaderboard(discordID, dotaID, data) {
    if (data) {
      const player = this.client.users.get(discordID);
      const rank = odutil.getMedal(data, 'raw');
      const update = {
        username: player.username || data.profile.personaname,
        nick: data.profile.personaname || '',
        avatar: player.avatarURL || data.profile.avatarmedium,
        rank: rank.rank,
        leaderboard: rank.leaderboard
      };
      return Promise.all([
        this.client.database
          .getBucket('leaderboard/ranking')
          .update({ [discordID]: update }),
        this.updatePublicLeaderboardPlayers()
      ]);
    } else {
      return this.client.components.Opendota.account(dotaID).then(([data]) =>
        this.updateAccountLeaderboard(discordID, dotaID, data)
      );
    }
  }
  deleteAccountLeaderboard(discordID) {
    return Promise.all([
      this.client.database.getBucket('leaderboard/ranking').remove(discordID),
      this.updatePublicLeaderboardPlayers()
    ]);
  }
  updatePublicLeaderboardPlayers() {
    return this.client.database.getBucket('public').update({
      users: this.client.database.getBucket('test-profiles')._cache.size
    });
  }
  socialLink(tag, id, show) {
    let link;
    if (tag === 'dota') {
      link = `https://www.dotabuff.com/players/${id}`;
    } else {
      link = `http://www.steamcommunity.com/profiles/${id}`;
    }
    return Markdown.link(link, tag, show);
  }
  socialLinks(account, mode = 'inline', show = 'embed') {
    const links = [this.socialLink('dota', account.dotaID, show)];
    if (mode == 'inline') {
      return links.join(' / ');
    } else if (mode == 'vertical') {
      return links.join('\n');
    }
  }
};
