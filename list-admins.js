const mongoose = require('mongoose');

async function listAdmins() {
  await mongoose.connect('mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend');
  const admins = await mongoose.connection.db.collection('members').find({ role: 'admin' }).toArray();
  console.log('--- ADMINS ---');
  admins.forEach(admin => {
    console.log(`Name: ${admin.fullName || admin.name || 'N/A'}, Email: ${admin.email}`);
  });
  console.log('--------------');
  process.exit(0);
}

listAdmins().catch(console.error);
