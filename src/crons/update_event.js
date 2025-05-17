import cron from 'node-cron';
import EventModel from '../../db/models/event_model.js';
 

export const updateEventStatus=()=>{ cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  try {
    const result = await EventModel.updateMany(
      { endDate: { $lt: now }, status: { $ne: 'Ended' } },
      { $set: { status: 'Ended' } }
    );
    const result2 = await EventModel.updateMany(
        { startDate: { $lt: now }, status: 'Draft' },
        { $set: { status: 'Published' } }
      );
    console.log(`  ${result.modifiedCount} events marked as Ended`);
    console.log(` ${result2.modifiedCount} events marked as Published`);
  } catch (err) {
    console.error(' Failed to update events:', err);
  }
});
};

export default updateEventStatus;
