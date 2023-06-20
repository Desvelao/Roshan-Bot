const Aghanim = require('aghanim')

module.exports = {
	name: 'gameinfo',
	category: 'General',
	description: 'Game information',
	type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
	scope: {
        type: 'guild',
        guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
    },
	options: [
		{
			name: 'game_name',
			description: 'Game name',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
			choices: [ //The possible choices for the options
				// {// TODO: comment or remove while Artifact is not enabled
				// 	name: "artifact",
				// 	value: "Artifact"
				// },
				{
					name: "dota2",
					value: "Dota 2"
				}
			]
		}
	],
	run: async function (interaction, client, command){
		const game_name = interaction.data.options.find(option => option.name === 'game_name').name
		if(game_name === 'artifact'){
			const info = await client.components.Artifact.gameInfo()
			return client.components.Locale.replyInteraction(interaction, 'game.currentplayers', { count: info.currentplayers, game :'Artifact'})
		}else{
			const info = await client.components.Dota.gameInfo()
			return client.components.Locale.replyInteraction(interaction, 'game.currentplayers', { count: info.currentplayers, game :'Dota 2'})
		}
	}
}
