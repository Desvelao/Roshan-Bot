module.exports = function createTaskUpdateLeaderBoard(ctx) {
  return {
    timer: '0 0 * * 0', // every sunday at 00:00
    execute: () => {
      if (ctx.client.config.switches.backupdb) {
        ctx.client.components.Bot.takeDatabaseBackup();
      }
    },
    options: {
      scheduled: true
    }
  };
};
