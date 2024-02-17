const { Command } = require('aghanim');

module.exports = new Command(
  'roshan',
  {
    category: 'Diretide',
    help: 'See Roshan status',
    args: ''
  },
  function (msg, args, client, command) {
    const game = command.game;
    const embed = {
      title: 'Roshan status',
      description: '',
      fields: [
        { name: 'Mode', value: game.status.getModeName(), inline: true }
        // {name : 'Duration', value : ` · ${timeSugarRush(game.status.sugarrush.next,'Next')}\n${timeSugarRush(game.status.sugarrush.current.start,'Current Start',game.actions.secondsToHms)}${timeSugarRush(game.status.sugarrush.current.end,'Current End',game.actions.secondsToHms)}\n\n`, inline : false}
      ],
      footer: { text: 'Diretide' }
    };
    try {
      if (game.status.status.mode === 0) {
        // embed.fields.push({name : 'Time remaining' , value : `${game.actions.secondsToHms(game.status.timeouts.sugarrush.remaining())}`, inline : true })
        embed.fields.push({
          name: 'Time remaining',
          value: `${timeRemainingTimeout(
            game.status.timeouts.sugarrush,
            game.actions.secondsToHms
          )}`,
          inline: true
        });
      } else if (game.status.status.mode === 1) {
        // embed.fields.push({name : 'Time remaining' , value : `${game.actions.secondsToHms(game.status.timeouts.active.remaining())}`, inline : true })
        embed.fields.push({
          name: 'Time remaining',
          value: `${timeRemainingTimeout(
            game.status.timeouts.active,
            game.actions.secondsToHms
          )}`,
          inline: true
        });
      }
    } catch (err) {
      client.error('ERROR Roshan command');
    }
    return game.reply(msg, game.status.embed(embed));
  }
);

function timeRemainingTimeout(timeout, func) {
  try {
    return func(timeout.remaining()) || '-'; //+ ' - ' + func((timeout.endTime() + - Date.now)/1000)
  } catch (err) {
    console.log(err);
    return '-';
  }
}
