module.exports = {
  name: '1v1rules',
  category: 'General',
  run: async function (msg, args, client, command){
    const baseModeName = '1v1rules'
    const modes = ['', ' nr'].map(mode => `${baseModeName}${mode}`)
    const mode = args.from(0)
    if (!modes.includes(mode)) { return msg.reply('cmd.wrongarg', { options: modes.join(', '), cmd: args.until(1)})}
    return msg.reply(`${mode.replace(/ /g,'')}.message`)
  }
}
