import mongoose from 'mongoose';
import { ConferenceSchema } from './src/modules/conferences/schemas/conference.schema';

async function seedImages() {
  try {
    await mongoose.connect('mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend');
    const Conference = mongoose.model('Conference', ConferenceSchema);

    // Find the latest conference
    const latestConference = await Conference.findOne().sort({ createdAt: -1 });

    if (latestConference) {
      latestConference.galleryImages = [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop'
      ];
      await latestConference.save();
      console.log('Successfully added gallery images to:', latestConference.title);
    } else {
      console.log('No conference found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedImages();
