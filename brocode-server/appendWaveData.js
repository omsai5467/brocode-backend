const fs = require("fs");

// Function to append PCM data to a wave file
function appendPCMDataToWaveFile(existingFilePath, newPCMData) {
  // Read the existing wave file
  const existingData = fs.readFileSync(existingFilePath);

  // Get the size of the existing wave file
  const fileSize = existingData.length;

  // Extract the existing header from the wave file
  const existingHeader = existingData.slice(0, 44);

  // Open the wave file in append mode
  const newWaveFile = fs.openSync("appended_file.wav", "a");

  // Write the existing header to the new wave file
  fs.writeSync(newWaveFile, existingHeader, 0, 44, 0);

  // Append the new PCM data to the new wave file
  fs.writeSync(newWaveFile, newPCMData, 0, newPCMData.length, fileSize);

  // Close the new wave file
  fs.closeSync(newWaveFile);
}

// Example usage

module.exports = { appendPCMDataToWaveFile };
