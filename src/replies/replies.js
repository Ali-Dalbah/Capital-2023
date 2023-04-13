const replies = require('./config');

function getReply(parameter) {
  switch(parameter) {
    case 'mjmd': return getRand(replies.mjmd);
    case 'ma3moul': return getRand(replies.ma3moul);
    case 'finished': return getRand(replies.finished);
    case 'notInVoice': return getRand(replies.notInVoice);
    case 'pause': return getRand(replies.pause);
    case 'stop': return getRand(replies.stop);
    case 'resume': return getRand(replies.resume);
    case 'start': return getRand(replies.start);
    case 'unknown': return getRand(replies.unknown);
    default: throw ('the parameter was not found');
  }
}

function getRand(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

module.exports = getReply;