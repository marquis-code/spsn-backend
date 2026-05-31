const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const admins = [
  { email: 'Kayjulius2@gmail.com', fullName: 'Juliu Bankole' },
  { email: 'Pennystockprof@gmail.com', fullName: 'Benard Solomon' },
  { email: 'ruthekhator1@gmail.com', fullName: 'Ruth Eghator' },
  { email: 'markeyz.code@gmail.com', fullName: 'Markeyz Code' }
];

async function seed() {
  await mongoose.connect('mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend');
  console.log('Connected to DB');

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  for (const { email, fullName } of admins) {
    const existing = await mongoose.connection.db.collection('members').findOne({ email });
    if (!existing) {
      await mongoose.connection.db.collection('members').insertOne({
        email,
        fullName,
        role: 'admin',
        status: 'Active',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created admin: ${email}`);
    } else {
      await mongoose.connection.db.collection('members').updateOne(
        { email },
        { 
          $set: { 
            role: 'admin', 
            status: 'Active',
            password: hashedPassword,
            fullName
          } 
        }
      );
      console.log(`Updated existing user to admin: ${email}`);
    }
  }

  console.log('Seeding complete. Default password is: Admin@123');
  process.exit(0);
}

seed().catch(console.error);
