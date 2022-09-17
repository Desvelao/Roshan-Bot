module.exports = {
  name: 'reset',
  childOf : 'server',
  category : 'Server',
  help : 'Reset the guild configuration',
  args : '',
  requirements: [
    {
      type: 'member.has.role',
      role: 'aegis',
      incaseSensitive: true
    }
  ],
  run: async function (msg, args, client, command){
    return client.components.Guild.createProcess(msg.channel.guild)
      .then(() => msg.reply('server.reset.message'))
  }
}
