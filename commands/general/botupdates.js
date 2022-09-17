module.exports = {
  name: 'botupdates',
  category: 'General',
  run: async function (msg, args, client, command){
    return msg.reply(client.cache.botPatchNotes)
  }
}
