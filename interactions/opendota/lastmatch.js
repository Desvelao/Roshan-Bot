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
			name: 'user_id',
			description: 'User ID',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false
		}
	],
  requirements: [
    'is.dota.player'
  ],
  run: async function(interaction, client, command){
    const [ player, results ] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_lastmatch(interaction.ctx.profile.data.dota)
    ])
    const commandMatch = client.interactionCommands.find(command => command.name === 'match')
    console.log({commandMatch}, interaction.data.options)
    if (!commandMatch) { return }
    !interaction.data.options && (interaction.data.options = [])
    interaction.data.options.push({value: results[0][0].match_id, name: 'match_id'})
    // TODO: fix when uses a player name. Interaction doesn't reply
    return await commandMatch.run(interaction, client, commandMatch)
  }
}
