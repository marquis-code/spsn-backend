const mongoose = require('mongoose');
require('dotenv').config();

const dropMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Check if the collection exists before dropping it to prevent errors
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasMembers = collections.some(col => col.name === 'members');
    
    if (hasMembers) {
      await mongoose.connection.db.dropCollection('members');
      console.log('Successfully dropped the "members" collection.');
    } else {
      console.log('Collection "members" does not exist.');
    }
  } catch (error) {
    console.error('Error dropping members collection:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  }
};

dropMembers();
