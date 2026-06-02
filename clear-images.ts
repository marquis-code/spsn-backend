import mongoose from 'mongoose';
import { ConferenceSchema } from './src/modules/conferences/schemas/conference.schema';

async function clearImages() {
  try {
    await mongoose.connect('mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend');
    const Conference = mongoose.model('Conference', ConferenceSchema);

    // Find the latest conference
    const latestConference = await Conference.findOne().sort({ createdAt: -1 });

    if (latestConference) {
      latestConference.galleryImages = [];
      await latestConference.save();
      console.log('Successfully cleared gallery images from:', latestConference.title);
    } else {
      console.log('No conference found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearImages();
