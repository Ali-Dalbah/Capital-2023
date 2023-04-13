const { createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const reply = require('../replies/replies');
class guildPlayer {
  constructor() {
    this.isPlaying = false;
    this.queue = [];
    this.connection = undefined;
    this.preferedTextChannel = undefined;
    this.currentSong = undefined;
    this.leave = undefined;
    this.audio = createAudioPlayer();
    this.setAuidoActions();
    this.loop = false;
  }

  setAuidoActions() {
    this.audio.addListener('stateChange', (oldOne, newOne) => {
      if (newOne.status == 'idle') {
        this.isPlaying = false;
        this.play();
        if (!this.isPlaying) {
          this.loop = false;
          this.preferedTextChannel.send(reply('finished'));
          this.currentSong = undefined;
        }
      } else if (newOne.status == 'autopaused' && (oldOne.status == 'idle' || oldOne.status == 'playing' || oldOne.status == 'paused')) {
        //if (this.connection) this.connection.destroy();
        this.connection = undefined;
        this.currentSong = undefined;
        this.loop = false;
        this.isPlaying = false;
        this.queue = [];
      } else if (oldOne.status == 'buffering' && newOne.status == 'playing') {
        this.preferedTextChannel.send(this.currentSong + reply('start'));
      } else if (newOne.status == 'paused') {
        this.preferedTextChannel.send(reply('pause'));
      } else if (newOne.status == 'playing' && oldOne.status == 'paused') {
        this.preferedTextChannel.send(reply('resume'));
      }
    });
    this.audio.on('error', error => {
      console.error(`Error: ${error.message} with resource ${error.resource}`);
      this.play();
    });
  }

  join(channel) {
    if (!channel.joinable) return false; 
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    this.connection.subscribe(this.audio);
    return true;
  }

  enQueue(query) {
    if (typeof query !== 'string') throw 'query has to be a string';
    this.queue.push(query);
    this.preferedTextChannel.send(query + ' انضافت عالطريق ' + (this.isPlaying ? ' بس ' + this.queue.length + ' قبلها!' : '!'));
  }

  async getAudioResource() {
    if (this.queue.length == 0) throw 'queue is Empty';
    this.currentSong = await this.search(this.queue.shift());
    try {
      return createAudioResource(ytdl(this.currentSong, {
        filter: "audioonly",
        opusEncoded: "true",
        quality: 'highestaudio',
        highWaterMark: 1 << 30,
      }));
    } catch (err) {
      console.log('Error: ' + err);
      return createAudioResource(ytdl('https://www.youtube.com/watch?v=slTlemJv9mE', {
        filter: "audioonly",
        opusEncoded: "true",
        quality: 'highestaudio',
        highWaterMark: 1 << 30,
      }));
    }
  }

  async play() {
    if (!this.connection) return;
    if (this.queue.length > 0 || (this.loop && this.currentSong)) {
      if (this.leave != undefined) {
        clearTimeout(this.leave);
        this.leave = undefined;
      }
      this.isPlaying = true;
      if (this.loop) this.addSongTop(this.currentSong);
      try {
      const resource = await this.getAudioResource();
      this.audio.play(resource);
      } catch (err) {
        console.log("Error "+ err);
      }
    } else {
      this.leave = setTimeout(() => {
        if (this.connection) this.connection.destroy();
        this.connection = undefined;
      }, 120000);
    }
  }

  async search(args) {
    if (args.includes('youtube.com') || args.includes('youtu.be') || args.includes('https:')) return args;
    let videos = await ytSearch(args);
    return videos.all[0].url;
  }

  pause() {
    if (!this.isPlaying) return false;
    this.audio.pause();
    this.isPlaying = false;
    return true;
  }

  resume() {
    if (this.isPlaying) return false;
    this.audio.unpause();
    this.isPlaying = true;
    return true;
  }

  stop() {
    this.loop = false;
    this.audio.stop();
    this.queue = [];
    this.currentSong = undefined;
    this.preferedTextChannel.send(reply('stop'));
    if (this.leave != undefined) {
      clearTimeout(this.leave);
    }
    if (this.connection) this.connection.destroy();
  }

  skip() {
    this.loop = false;
    this.preferedTextChannel.send('ماشي، مشينا عن الليف');
    this.play();
    this.loop = true;
  }

  setLoop() {
    this.loop = !this.loop;
    if (this.loop) this.preferedTextChannel.send('بلشنا نلفلف بدوائر');
    else this.preferedTextChannel.send('كنت مبسوط و انا بلفلف :(');
  }

  addSongTop(name) {
    const reserveQueue = [...this.queue];
    this.queue = [];
    if (name) this.queue.push(name);
    while (reserveQueue.length) {
      this.queue.push(reserveQueue.shift());
    }
  }


  // async seek(ms) {
  //   const resource = createAudioResource(ytdl("https://youtu.be/LsbFZhlo5Vk?t=1262", {
  //       filter: "audioonly",
  //       opusEncoded: "true",
  //       quality: 'highestaudio',
  //       highWaterMark: 1 << 30,
  //     }));
  //   this.audio.play(resource);
  //   this.isPlaying = true;
  // }
  // weak() {
  //   clone queue
  //   destroy queue
  //   get weak.mp3
  //   get seek point
  //   stop
  //   play weak
  //   when finish start queue again
  //   seek song to point
  // }
}
module.exports = guildPlayer;