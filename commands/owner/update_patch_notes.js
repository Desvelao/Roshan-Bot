const { Command } = require('aghanim')

module.exports = {
  name: 'updatepatchnotes',
  category : 'Owner',
  help : 'Reload the "r!new" message',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return client.components.Bot.loadLastPatchNotes()
  }
}
