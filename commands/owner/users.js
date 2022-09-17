module.exports = {
  name: 'users',
  category : 'Owner',
  help : 'Count of registered users',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return msg.reply('users.amount', { users: client.cache.profiles.size})
  }
}
