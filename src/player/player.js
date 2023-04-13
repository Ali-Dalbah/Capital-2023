GuildPlayer = require('./guildPlayer');
class Player {
  constructor() {
    this.players = new Map();
  }
  getPlayer(guildId) {
    return this.players.get(guildId);
  }
  addPlayer(guildId) {
    this.players.set(guildId, new GuildPlayer());
  }
  addSong(guildId, voice, query, textChannel) {
    if (!this.players.has(guildId)) this.addPlayer(guildId);
    const player = this.getPlayer(guildId);
    this.setPreferedTextChannel(player, textChannel);
    player.enQueue(query);
    if (!player.isPlaying) {
      if (!player.connection) player.join(voice);
      player.play();
    }
  }
  setPreferedTextChannel(player, textChannel) {
    if (player.preferedTextChannel == undefined)
      player.preferedTextChannel = textChannel;
  }
  pause(guildId) {
    return this.getPlayer(guildId)?.pause();
  }
  resume(guildId) {
    return this.getPlayer(guildId)?.resume();
  }
  skip(guildId) {
    this.getPlayer(guildId)?.skip();
  }
  stop(guildId) {
    this.getPlayer(guildId)?.stop();
    this.players.delete(guildId);
  }

  loop(guildId) {
    const player = this.getPlayer(guildId);
    if (player?.isPlaying || player?.currentSong) player.setLoop();
  }

  /*async seek(guildId, ms) {
    const player = this.getPlayer(guildId);
    console.log(ms);
    if (player?.isPlaying || player?.currentSong) player.seek(ms);
  }*/

}
module.exports = Player;