const Aghanim = require('aghanim')

module.exports = {
	name: 'patch',
	description: 'Current Dota 2 patch',
	type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
	scope: {
        type: 'guild',
        guildIDs: [process.env.DEV_SERVER_ID]
    },
	run(interaction, client){
		return interaction.createMessage(client.cache.dota2Patch)
	}
}