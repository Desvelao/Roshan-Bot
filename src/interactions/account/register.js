const Aghanim = require('aghanim');

module.exports = {
  name: 'register',
  category: 'Account',
  description: 'Register player',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'dota_id',
      description: 'Dota ID',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: true
    }
  ],
  requirements: ['account.not.registered'],
  scope: {
    type: 'global'
  },
  run: async function (interaction, client, command) {
    const dotaID = interaction.data.options.find(
      (option) => option.name === 'dota_id'
    ).value;

    const discordID = interaction.user.id;

    const guildName = interaction.channel.guild
      ? interaction.channel.guild.name
      : 'DM';
    const guildID = interaction.channel.guild
      ? interaction.channel.guild.id
      : interaction.channel.id;
    const [data] = await client.components.Opendota.account(dotaID);
    if (!data.profile) {
      throw new Error('Profile not found');
    }

    const messageNotificationServer = await client.createMessage(
      process.env.DISCORD_MANAGEMENT_SERVER_CHANNEL_ACCOUNTS_ID,
      {
        embed: {
          title: client.components.Locale.translateAsDefaultUser(
            'notify.account.new.title',

            { user_account_id: interaction.user.id }
          ),
          description: client.components.Locale.translateAsDefaultUser(
            'notify.account.new.data',
            {
              guild_name: guildName,
              guild_id: guildID,
              user_account_dotaID: dotaID
            }
          ),
          footer: {
            text: interaction.user.username + ' | ' + interaction.user.id,
            icon_url: interaction.user.avatarURL
          },
          color: client.config.colors.account.register
        }
      }
    );
    await client.profilesManager.createUserAccount(discordID, { dota: dotaID });

    client.emit('profile:register', {
      profile: { id: discordID, dota: dotaID },
      context: {
        guild_name: guildName,
        guild_id: guildID,
        username: interaction.user.username,
        avatar_url: interaction.user.avatarURL
      }
    });

    // TODO: add to leaderboards

    await messageNotificationServer.addReactionSuccess();

    return await client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'roshan.welcometo',
          description: 'interaction.roshan.info_about',
          fields: [
            {
              name: 'interaction.register.your_data',
              value: 'interaction.register.your_data_account',
              inline: false
            },
            {
              name: 'interaction.register.ty_for_your_registry',
              value: 'interaction.register.help_description',
              inline: false
            }
          ],
          thumbnail: { url: 'user.avatar.url' }
        }
      },
      { user_account_dota: dotaID, user_avatar_url: interaction.user.avatarURL }
    );
  }
};
