const { Command } = require('aghanim')
const messages = require('../../containers/messages.json')
const { UserError, ConsoleError } = require('../../classes/errormanager')

const rules = {}
rules['1v1rules'] = messages['1v1rules']
rules['1v1rules nr'] = messages['1v1rules nr']

module.exports = new Command('1v1rules',{
  category : 'General', help : 'Reglas básicas de 1v1', args : '[nr]'},
  function(msg, args, command){
    let query = args[0]
    if(args[1]){query += ' ' + args[1]}
    if (!rules[query]) { throw new UserError('1v1rules', 'wrongCmdArg', { options: Object.keys(rules).join(', '), cmd: args.until(1)})}
    return msg.reply(rules[query])
  })