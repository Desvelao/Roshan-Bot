module.exports = function createTaskUpdateLeaderBoard(ctx) {
  return {
    timer: '* * * * 0', // every sunday at 00:00
    execute: () => {
      if (ctx.client.config.switches.publicDataUpdate) {
        ctx.client.components.Bot.updatePublicData();
      }
    },
    options: {
      scheduled: true
    }
  };
};
