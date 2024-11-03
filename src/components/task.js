const { Component } = require('aghanim');
const { TaskManager } = require('../repositories/task/task-manager');
const path = require('path');
const glob = require('glob');

module.exports = class Task extends Component {
  constructor(client, options) {
    super(client);
    this.client.taskManager = new TaskManager(this.client.logger);
    this.client.once('database:init', () => {
      this.loadTasksFromDirectory(path.join(__dirname, '../tasks'));
    });
  }

  loadTasksFromDirectory(directory, ctx) {
    const pattern = `${directory}/*.js`;
    const filenames = glob.sync(pattern);

    filenames.forEach((filename) => {
      try {
        const taskRequired = require(filename);
        const task =
          typeof taskRequired === 'function'
            ? taskRequired(this, ctx)
            : taskRequired;
        this.client.taskManager.create(task);
        this.client.logger.debug(`Task added from ${filename}`);
      } catch (e) {
        this.client.logger.error(
          `Error adding task [${filename}]: ${e.message}`
        );
      }
    });
  }
};
