const Aghanim = require('aghanim')
const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'rankup',
  category: 'General',
  description: 'RankUp',
	type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    const fileData = await fs.promises.readFile(path.join(__dirname, '../..', '/img/rankup.png'))
    return client.components.Locale.replyInteraction(interaction, {content: 'RankUp', file: {file: fileData, name :'rankup.png'}}, {}, )
  }
}