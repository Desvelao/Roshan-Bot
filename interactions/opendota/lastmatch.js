const Aghanim = require('aghanim')

module.exports = {
  name: 'lastmatch',
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
			description: 'Dota player ID',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false
		}
	],
  requirements: [
    'is.dota.player'
  ],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DEV_SERVER_ID]
  },
  run: async function(interaction, client, command){
    const [ player, results ] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_lastmatch(interaction.ctx.profile.data.dota)
    ])
    const commandMatch = client.interactionCommands.find(command => command.name === 'match')

    if (!commandMatch) { return }
    !interaction.data.options && (interaction.data.options = [])
    interaction.data.options.push({value: results[0][0].match_id, name: 'match_id'})

    return await commandMatch.run(interaction, client, commandMatch)
  }
}
