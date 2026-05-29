const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scpsn');
  const db = mongoose.connection;
  const membersCollection = db.collection('members');

  const result = await membersCollection.updateOne(
    { email: 'abahmarquis@gmail.com' },
    { $set: { "enrollmentInfo.membershipType": "New" } }
  );
  
  console.log('Update result:', result);
  
  await mongoose.disconnect();
}
run().catch(console.error);
