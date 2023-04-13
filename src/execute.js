const reply = require('./replies/replies');
module.exports = async (msg, player) => {
  if (msg.author.bot) return;
  switch(msg.author.tag) {
      /*case "WizardKestrel#7873":msg.channel.send(reply('mjmd'));break;*/
    case "Sha777#1134": {
      if (msg.content.includes("تعبان يا شيخي"))
        msg.channel.send("نفسي انيك بس مش قادر");
      break;
    } 
    case "not_yaaz#3439": {
      if (Math.random() > 0.5) msg.channel.send(reply('mjmd'));break;
    }
      // case "magicmood#2982": {
      //   if (Math.random() > 0.25) break;
      //   msg.reply({
      //   files: [{attachment: reply('ma3moul'),
      //   name: 'pepe.gif'}],
      //   content: `معمول`}
      //   );
      //   break;
      // }
      default:break;
    }
  if (!msg.content.startsWith('$')) return;
  const message = msg.content.substring(1);
  const s = message.indexOf(' ') == -1 ? message.length : message.indexOf(' ');
  const cmd = message.substring(0, s);
  const args = message.substring(s + 1);
  if (cmd.trim().toLowerCase() === 'help' ||  cmd.trim().toLowerCase() === 'مساعدة') {
      return void msg.reply('To play music (جيب/هات/شغل/play)\n' +
        'To pause current music (pause/وقف)\n' +
        'To resume current music (كمل/resume)\n' +
        'To skip current music (مشي/skip)\n' +
        'To stop music (مشي/اغليها/stop)\n' +
        'To toggle loop on current song (loop/لفلف)\n');
    }
  if (!msg.member.voice?.channel) return void await msg.reply(reply('notInVoice'));
  if (msg.guild.members.me.voice.channelId && msg.member.voice.channelId !== msg.guild.members.me.voice.channelId) return void await msg.reply('انت مش بالشانيل تبعتي');
  switch (cmd.trim().toLowerCase()) {
    case "get":
    case "p":
    case "هات":
    case "شغل":
    case "جيب":
    case "جيبلي":
    case "هتلك":
    case 'play': return void player.addSong(msg.guild.id, msg.member.voice.channel, args, msg.channel);
    case "وقف":
    case 'pause': return void player.pause(msg.guild.id);
    case 'كمل':
    case 'resume': return void player.resume(msg.guild.id);
    case 'مشي':
    case 'skip': return void player.skip(msg.guild.id);
    case "اغليها":
    case 'اطلع':
    case 'قبع':
    case 'قبّع':
    case 'كسمك':
    case 'stop': return void player.stop(msg.guild.id);
    case 'لفلف':
    case 'loop': return void player.loop(msg.guild.id);
    //case 'seek': return void player.seek(msg.guild.id, args);
    default: return void await msg.reply(reply('unknown'));
  }
}