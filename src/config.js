import { readFileSync } from 'fs';

const configFile = readFileSync('./config.json', 'utf8');
const config = JSON.parse(configFile);

const webhookURL = config['webhookURL'];
const youtubeApiKey = config['youtubeApiKey'];
const youtubeChannel = config['youtubeChannel'];

export {
  webhookURL,
  youtubeApiKey,
  youtubeChannel
}