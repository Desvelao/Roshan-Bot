const cron = require('node-cron');

class Task {
  constructor(ctx) {
    this.ctx = ctx;
    this.task = cron.schedule(
      this.ctx.timer,
      this.ctx.execute,
      this.ctx.options || undefined
    );
  }
  start() {
    this.task.start();
  }
  stop() {
    this.task.stop();
  }
}

module.exports.Task = constructor;

module.exports.TaskManager = class TaskManager {
  constructor(logger) {
    this.logger = logger;
    this._tasks = [];
  }
  add(task) {
    this._tasks.push(task);
    return () => {
      task.stop();
      this._tasks.filter((t) => task !== t);
    };
  }
  create(ctx) {
    const task = new Task(ctx);
    this.add(task);
    return task;
  }
};
