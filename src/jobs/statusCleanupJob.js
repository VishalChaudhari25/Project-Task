    // src/jobs/statusCleanupJob.js
    import cron from 'node-cron';
    import db from '../models/index.js';
    import { Op } from 'sequelize';

    const { Status } = db;

    export const startStatusCleanupJob = () => {
      // Schedule the job to run every hour
      cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled status cleanup job...');
        try {
          const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

          const deletedCount = await Status.destroy({
            where: {
              createdAt: {
                [Op.lt]: twentyFourHoursAgo, // Delete statuses older than 24 hours
              },
            },
          });
          console.log(`Deleted ${deletedCount} expired statuses.`);
        } catch (error) {
          console.error('Error during status cleanup job:', error);
        }
      });
      console.log('Status cleanup job scheduled.');
    };
    