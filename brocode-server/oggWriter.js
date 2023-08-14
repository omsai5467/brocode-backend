const fs = require("fs");
const OpusEncoder = require("opus.js").Encoder;
const net = require("net");
const sampleRate = 44100;
const channels = 2; // Set the number of channels to 2 for stereo
const frameSize = 960;
const encoder = new OpusEncoder(
  sampleRate,
  channels,
  OpusEncoder.Application.AUDIO
);

const outputStream = fs.createWriteStream("output.ogg");

function EncodeOgg(data) {
  const pcmData = new Int16Array(data.buffer);
  let offset = 0;
  while (offset < pcmData.length) {
    const inputBuffer = pcmData.subarray(offset, offset + frameSize * channels);
    const encodedData = encoder.encode(inputBuffer, frameSize);
    outputStream.write(Buffer.from(encodedData));

    offset += frameSize * channels;
  }
}

module.exports = { EncodeOgg };
