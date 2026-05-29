const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scpsn');
  const db = mongoose.connection;
  const membersCollection = db.collection('members');

  const email = 'abahmarquis@gmail.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const existing = await membersCollection.findOne({ email });
  if (existing) {
    await membersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword, role: 'admin' } }
    );
    console.log('Updated existing user abahmarquis@gmail.com to admin with password admin123');
  } else {
    await membersCollection.insertOne({
      fullName: 'Admin User',
      email: email,
      password: hashedPassword,
      phoneNumber: '0000000000',
      role: 'admin',
      status: 'Active',
      category: 'Full',
      isBoardMember: false,
      isActive: true,
      enrollmentInfo: {
        membershipType: 'Professional',
        institution: 'SCPSN HQ',
        paymentStatus: 'Verified',
        enrollmentDate: new Date()
      }
    });
    console.log('Created new admin user abahmarquis@gmail.com with password admin123');
  }
  
  await mongoose.disconnect();
}
run().catch(console.error);
