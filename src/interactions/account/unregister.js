const Aghanim = require('aghanim');

module.exports = {
  name: 'unregister',
  category: 'Account',
  description: "Delete your Roshan's account",
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  requirements: ['account.exist'],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const discordID = interaction.user.id;
    const guildName = interaction.channel.guild
      ? interaction.channel.guild.name
      : 'DM';
    const guildID = interaction.channel.guild
      ? interaction.channel.guild.id
      : interaction.channel.id;
    const messageNotificationServer = await client.createMessage(
      process.env.DISCORD_PIT_SERVER_CHANNEL_ACCOUNTS_ID,
      {
        embed: {
          title: client.components.Locale.translateAsDefaultUser(
            'unregisterAccountTitle',
            { user_account_id: interaction.user.id }
          ),
          description: client.components.Locale.translateAsDefaultUser(
            'unregisterAccountDesc',
            { guildName, guildID }
          ),
          footer: {
            text: interaction.user.username + ' | ' + interaction.user.id,
            icon_url: interaction.user.avatarURL
          },
          color: client.config.colors.account.delete
        }
      }
    );
    await client.profilesManager.removeUserAccount(discordID);

    client.emit('profile:unregister', {
      profile: { _id: discordID },
      context: {
        guild_name: guildName,
        guild_id: guildID,
        username: interaction.user.username,
        avatar_url: interaction.user.avatarURL
      }
    });

    // TODO: delete account from leaderboard
    await messageNotificationServer.addReactionSuccess();
    return await client.components.Locale.replyInteraction(
      interaction,
      'account.deleted'
    );
  }
};
