const Aghanim = require('aghanim');
const path = require('path');
require('dotenv').config();

//Initialize Bot with Aghanim Command Client
const bot = new Aghanim(process.env.DISCORD_BOT_TOKEN);

bot.isProduction = process.env.NODE_ENV === 'production';

// Add categories
// Define categories for commands
[
  { name: 'General', description: 'Ayuda de general' },
  { name: 'Dota 2', description: 'Ayuda de Dota 2' },
  {
    name: 'Account',
    description: 'Ayuda para la gestión de la cuenta en Roshan'
  },
  { name: 'Server', description: 'Ayuda para comandos de servidor' },
  { name: 'Owner', description: 'Ayuda para comandos de propietario' },
  { name: 'Fun', description: 'Ayuda para comandos de emojis y memes' },
  { name: 'Artifact', description: 'Ayuda los comandos de Artifact' },
  {
    name: 'DevServer',
    description: 'Ayuda los comandos del servidor de desarrollo'
  }
  // { name: 'Underlords', description: 'Ayuda los comandos de Dota Underlords' },
].forEach((category) => bot.addCategory(category.name, category.description));

// Load components
bot.addComponentDir(path.join(__dirname, 'components'));
// bot.addComponentFile(path.join(__dirname, 'seasonal/duel/duel.component'));

//Load commands
[
  'interactions/account',
  'interactions/dota2',
  'interactions/opendota',
  'interactions/general',
  'interactions/playercard',
  'interactions/underlords'
].forEach((dir) => bot.addInteractionCommandDir(path.join(__dirname, dir)));

process.on('unhandledRejection', (reason, p) => {
  Promise.resolve(p)
    .then((val) => {
      bot.emit('error', new Error(`Unhandled Rejection at: ${val}\n${reason}`));
    })
    .catch((err) => {
      bot.emit(
        'error',
        new Error(`Unhandled Rejection Rejected at: ${err.stack}\n${reason}`)
      );
    });
  // application specific logging, throwing an error, or other logic here
});

bot.connect();
