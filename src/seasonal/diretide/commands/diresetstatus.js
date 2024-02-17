const { Command } = require('aghanim');

module.exports = new Command(
  'diresetstatus',
  {
    category: 'Diretide',
    help: '',
    args: '',
    ownerOnly: true
  },
  function (msg, args, command) {
    const game = command.game;
    if (!args[1]) {
      return command.error();
    }
    return game.status.statusTo(args[1]);
  }
);
