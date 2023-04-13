const { Client, Partials, GatewayIntentBits, ActivityType } = require("discord.js");
const client = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites],
        partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]});
const {reminders} = require('./src/reminders');
client.login(process.env['TOKEN']);
client.on("ready", () => {
  console.log(`${client.user.tag} is online`);
  client.user.setActivity({
        name: "Music 🚬 | $help",
        type: ActivityType.Playing 
  });
  reminders(client.channels.cache.get('779015218851610637'));
  let servers = 0;
   client.guilds.cache.map(guild => {
     servers++;
   });
  console.log(servers);
});
client.on("error", console.error);
client.on("warn", console.warn);
const Player = require('./src/player/player');
require('./src/server')();
const player = new Player();
const execute = require('./src/execute');

client.on('messageCreate', async (msg) => {
  execute(msg, player);
});
const {exec} = require('child_process');

function kill() {
  setTimeout(kill, 60000);
  if (client.user) return;
  console.log(`kill`);
  exec('kill 1', (error, stdout, stderr) => {
      if (error) {
        console.log(`${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`${stderr}`);
        return;
      }
  });
}
setTimeout(kill, 60000);