const Aghanim = require('aghanim');

module.exports = {
  name: 'account',
  category: 'Account',
  description: 'Show your account info',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'user_id',
      description: 'User',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    },
    {
      name: 'user_mention',
      description: 'User',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.USER,
      required: false
    }
  ],
  requirements: ['account.existany'],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const isSupporter = client.profilesManager.getUserProfile(
      interaction.ctx.user.id
    ).supporter;
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'account.title',
          description: 'account.data',
          thumbnail: { url: '{{{user_avatar_url}}}' }
        }
      },
      {
        supporter: isSupporter ? `\n${client.config.emojis.bot.cheesed2}` : '',
        user_id: interaction.ctx.account._id,
        user_name: interaction.ctx.user.username,
        user_account_dota: interaction.ctx.account.dota,
        user_account_lang: interaction.ctx.account.lang,
        user_avatar_url: interaction.ctx.user.avatarURL
      }
    );
  }
};
