'use strict';

const CLITable = require('cli-table3');
const chalk = require('chalk');

const strapi = require('../../../../index');

module.exports = async () => {
  const appContext = await strapi.compile();
  const app = await strapi(appContext).register();

  const list = Object.keys(app.components);

  const infoTable = new CLITable({
    head: [chalk.blue('Name')],
  });

  list.forEach((name) => infoTable.push([name]));

  console.log(infoTable.toString());

  await app.destroy();
};
