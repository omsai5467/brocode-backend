const fs = require("fs");

// WAV file parameters
const sampleRate = 44100; // Sample rate in Hz
const channels = 2; // Number of audio channels
const bitsPerSample = 32; // Bit depth

// Calculate the byte rate and block align values
const byteRate = sampleRate * channels * (bitsPerSample / 8);
const blockAlign = channels * (bitsPerSample / 8);

// Create the WAV header
const header = Buffer.alloc(44);
header.write("RIFF", 0); // Chunk ID
header.writeUInt32LE(0, 4); // Chunk Size (to be updated later)
header.write("WAVE", 8); // Format

header.write("fmt ", 12); // Subchunk1 ID
header.writeUInt32LE(16, 16); // Subchunk1 Size
header.writeUInt16LE(1, 20); // Audio Format (PCM)
header.writeUInt16LE(channels, 22); // Number of Channels
header.writeUInt32LE(sampleRate, 24); // Sample Rate
header.writeUInt32LE(byteRate, 28); // Byte Rate
header.writeUInt16LE(blockAlign, 32); // Block Align
header.writeUInt16LE(bitsPerSample, 34); // Bits per Sample

header.write("data", 36); // Subchunk2 ID
header.writeUInt32LE(0, 40); // Subchunk2 Size (to be updated later)

// Create a writable stream to the output WAV file
const outputStream = fs.createWriteStream("output.wav");
outputStream.write(header);

// Handle the PCM data received from the server
function handlePcmData(pcmData) {
  outputStream.write(pcmData);
}

// Example: Simulating continuous PCM data reception (replace with your actual server logic)
module.exports = { handlePcmData };
