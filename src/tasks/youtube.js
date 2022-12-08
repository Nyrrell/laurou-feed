import axios from "axios";

import { youtube } from "../db.js";
import { youtubeApiKey, youtubeChannel, webhookURL } from "../config.js";

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: { 'key': youtubeApiKey }
});

const discordWebhook = axios.create();

const fetchVideo = async (uploadsPlaylistId, storedVideos) => {
  try {
    const videos = [] = await youtubeApi.get(`playlistItems?part=snippet%2CcontentDetails&playlistId=${uploadsPlaylistId}&order=date`).then(({ data }) => data['items']);
    if (!videos.length) return;

    for await (const video of videos) {
      if (storedVideos?.find(({ id }) => id === video['contentDetails']['videoId'])) continue;

      const videoId = video['contentDetails']['videoId'];
      const videoTitle = video['snippet']['title'];
      const videoDesc = video['snippet']['description'];
      const videoChannel = video['snippet']['channelTitle'];
      const videoThumb = video['snippet']['thumbnails']['high']['url'];

      await discordWebhook.post(webhookURL, {
        content : `https://www.youtube.com/watch?v=${videoId}`
      })

      await youtube.create({
        "id": videoId,
        "channel": videoChannel,
        "title": videoTitle,
        "descr": videoDesc,
        "thumb": videoThumb,
        "channelId": video['snippet']['channelId'],
        "createdAt": video['snippet']['publishedAt']
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const youtubeFeed = async () => {
  const storedVideos = await youtube.findAll();
  for (const { uploadsPlaylistId } of youtubeChannel) {
      await fetchVideo(uploadsPlaylistId, storedVideos);
  }
}