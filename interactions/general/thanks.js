const Aghanim = require('aghanim')

module.exports = {
  name: 'thanks',
  category: 'General',
  description : 'Acknowledgments',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DEV_SERVER_ID]
  },
  run: async function (interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title : 'thanks.title',
        fields:[
          {name: 'thanks.fields0.name', value: '{{{_betatesters}}}', inline : false},
          {name: 'thanks.fields1.name', value: '{{{_complements}}}', inline : false}
        ]
      }
    }, {
      _betatesters: client.config.others.betatesters.join(', '),
      _complements: client.config.others.complements.map(c => `${c.tag}: ${c.author}`).join('\n')
    })
  }
}
