// import the playht SDK
import "dotenv/config";
import * as PlayHT from "playht";
import fs from "fs";

// Initialize PlayHT API with your credentials
PlayHT.init({
  apiKey: process.env.PLAY_HT_API_KEY,
  userId: process.env.PLAY_HT_USER_ID,
});

// configure your stream
const streamingOptions = {
  // must use turbo for the best latency
  voiceEngine: "PlayHT2.0-turbo",
  // this voice id can be one of our prebuilt voices or your own voice clone id, refer to the`listVoices()` method for a list of supported voices.
  voiceId:
    "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
  // you can pass any value between 8000 and 48000, 24000 is default
  sampleRate: 44100,
  // the generated audio encoding, supports 'raw' | 'mp3' | 'wav' | 'ogg' | 'flac' | 'mulaw'
  outputFormat: 'mp3',
  // playback rate of generated speech
  speed: 1,
};

// start streaming!
const text = "Hey, this is Jennifer from Play. Please hold on a moment, let me just um pull up your details real quick."
const stream = await PlayHT.stream(text, streamingOptions);

// Create a writable stream to save the audio file
const writeStream = fs.createWriteStream('output.mp3');

stream.on("data", (chunk) => {
  // Do whatever you want with the stream, you could save it to a file, stream it in realtime to the browser or app, or to a telephony system
  writeStream.write(chunk);
});

// Handle the end event to close the file stream
stream.on("end", () => {
  writeStream.end();
  console.log("Audio file saved as output.mp3");
});

// Handle error events
stream.on("error", (error) => {
  console.error("Error streaming audio:", error);
  writeStream.end();
});