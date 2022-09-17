module.exports = {
  name: 'patch',
  category : 'Dota 2',
  help : 'Current Dota 2 patch',
  args : '',
  response: (msg, args, client, command) => client.cache.dota2Patch,
}
