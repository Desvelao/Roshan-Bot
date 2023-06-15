const Aghanim = require('aghanim')

module.exports = {
  name: 'about',
  category: 'General',
  description : 'About',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DEV_SERVER_ID]
  },
  run: async function (interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'about.title',
        description: 'about.description',
        fields: [
          { name: 'about.invite', value: 'about.invitation', inline: false},
          { name: 'about.devserver', value: 'about.invitedevserver', inline: false},
          { name: 'global.donate', value: 'about.support', inline: false}
        ],
        footer : {text : 'about.footer', icon_url: '{{{bot_icon}}}'}
      }
    })
  }
}