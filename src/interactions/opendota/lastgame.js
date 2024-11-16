const Aghanim = require('aghanim');

module.exports = {
  name: 'lastgame',
  category: 'Dota 2',
  description: 'Last played game',
  options: [
    {
      name: 'user_mention',
      description: 'User mention',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    },
    {
      name: 'dota_player_id',
      description: 'Dota player ID or PRO name',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    }
  ],
  requirements: ['is.dota.player'],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_MANAGEMENT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const [player, results] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_lastmatch(
        interaction.ctx.profile.dotaID
      )
    ]);
    const commandMatch = client.interactionCommands.find(
      (command) => command.name === 'game'
    );

    // TODO: fix problem mentioning user id
    if (!commandMatch) {
      return;
    }
    !interaction.data.options && (interaction.data.options = []);
    interaction.data.options.push({
      value: results[0][0].match_id,
      name: 'game_id'
    });

    return await commandMatch.run(interaction, client, commandMatch);
  }
};
