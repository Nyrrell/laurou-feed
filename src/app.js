import cron from 'node-cron';

import { youtubeFeed } from "./tasks/youtube.js";

// At 1 minutes past the hour
cron.schedule('1 * * * *', async () => {
    await youtubeFeed();
});