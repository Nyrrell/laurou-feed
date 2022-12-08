import axios from "axios";

import { youtube } from "./db.js";
import { youtubeApiKey, youtubeChannel } from "./config.js";

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: { 'key': youtubeApiKey }
});

const populateDB = async (channelId) => {
  try {
    let nextPageToken;
    const videos = [];
    const playlists = [];

    do {
      await youtubeApi.get(`playlists?part=snippet%2CcontentDetails&maxResults=50&channelId=${channelId}${nextPageToken ? '&pageToken='+nextPageToken : ""}`,)
      .then(({ data }) => {
          data['items'].forEach(playlist => playlists.push(playlist));
          nextPageToken = data['nextPageToken'];
      });
    } while (nextPageToken)

    for (const { id } of playlists) {
      do {
          await youtubeApi.get(`playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${id}${nextPageToken ? '&pageToken='+nextPageToken : ""}`,)
          .then(({ data }) => {
              data['items'].forEach(video => videos.push(video));
              nextPageToken = data['nextPageToken'];
          });
      } while (nextPageToken)
    }

    for (const video of videos) {
        await youtube.findOrCreate({
          where: { "id": video['contentDetails']['videoId'] },
          defaults : {
            "channel": video['snippet']['channelTitle'],
            "title": video['snippet']['title'],
            "descr": video['snippet']['description'],
            "thumb": video['snippet']['thumbnails']['high']?.['url'],
            "channelId": video['snippet']['channelId'],
            "createdAt": video['snippet']['publishedAt']
          }
        });
    }
  } catch(e) {console.log(e)}
}

for (const { channelId } of youtubeChannel) {
    await populateDB(channelId);
}