module.exports = {
  name: 'feedback',
  category: 'General',
  requirements: [
    {
      validate: (msg, args) => args.length > 4,
      response: (msg, args) => msg.author.locale('feedback.minimum_words')
    }
  ],
  run: async function (msg, args, client, command){
    return client.createMessage(client.config.guild.bugs,{embed : {
      title : 'Feedback',
      description : args.after,
      footer : {text : msg.author.username, icon_url : msg.author.avatarURL},
      color : client.config.color}
    }).then(() => msg.addReaction(client.config.emojis.default.envelopeIncoming))
  }
}
