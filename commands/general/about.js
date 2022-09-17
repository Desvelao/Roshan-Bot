module.exports = {
  name: 'about',
  category: 'General',
  run: async function (msg, args, client, command){
    return msg.reply({
      embed: {
        title: 'about.title',
        description: 'about.description',
        fields: [
          { name: 'about.invite', value: 'about.invitation', inline: false},
          { name: 'about.devserver', value: 'about.invitedevserver', inline: false},
          { name: 'global.donate', value: 'about.support', inline: false}
        ],
        footer : {text : 'about.footer', icon_url: '<bot_icon>'}
      }
    })
  }
}