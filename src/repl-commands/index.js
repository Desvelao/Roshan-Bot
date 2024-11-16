const replCommandGuildRegister = require('./guild');
const replCommandUserRegister = require('./user');

module.exports.registerREPLCommands = function ({
  register,
  CommandRepl,
  helpfunction
}) {
  replCommandGuildRegister({
    register,
    CommandRepl,
    helpfunction
  });

  replCommandUserRegister({
    register,
    CommandRepl,
    helpfunction
  });
};
