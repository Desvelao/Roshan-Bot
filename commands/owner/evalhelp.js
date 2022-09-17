const variables = [
  {id : 'bot', desc : 'Bot'},
  {id : '_guild', desc : 'Current guild'},
  {id : '_channel', desc : 'Current channel'},
  {id : '_user', desc : 'Author message'}
]

module.exports = {
  name: ['evalhelp','eh'],
  category : 'Owner',
  help : '',
  args : '',
  hide : true,
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return msg.reply({embed : {
      title : 'Eval - Help',
      fields : [{name : 'Variables', value : variables.map(v => `**${v.id}** - ${v.desc}`).join('\n'), inline : false}],
      color : client.config.color
    }})
  }
}
