const Aghanim = require('aghanim');

module.exports = {
  name: 'id',
  category: 'Account',
  description: 'Links to Dotabuff and Steam',
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
    type: 'global'
  },
  run: async function (interaction, client, command) {
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'interaction.id.title',
          fields: [
            {
              name: 'interaction.id.info',
              value: 'player.social_links',
              inline: true
            }
          ],
          thumbnail: { url: 'user.avatar.url' }
        }
      },
      {
        social_links: client.components.Account.socialLinks(
          // TODO: fix links
          { dotaID: interaction.ctx.account.dota },
          'vertical',
          'embed+link'
        ),
        user_id: interaction.ctx.account._id,
        user_name: interaction.ctx.user.username,
        user_avatar_url: interaction.ctx.user.avatarURL
      }
    );
  }
};
