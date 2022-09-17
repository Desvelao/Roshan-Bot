module.exports = {
  name: ['lastmatch','lastgame'],
  category: 'Dota 2',
  help: 'Last played game',
  args: '[mention/dotaID/pro]',
  requirements: ["is.dota.player"],
  run: async function(msg, args, client, command){
    client.sendChannelTyping(msg.channel.id)
    const [ player, results ] = await Promise.all([
      args.profile,
      client.components.Opendota.player_lastmatch(args.profile.data.dota)
    ])
    const cmd = client.getCommandByName('match')
    if (!cmd) { return }
    msg.content = client.prefix + cmd.name + ' ' + results[0][0].match_id;
    args[0] = cmd.name;
    args[1] = results[0][0].match_id
    return await cmd.run(msg, args, client, cmd)
  }
}
