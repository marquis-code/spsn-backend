import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const uri = MONGODB_URI as string;

const MemberSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  membershipId: String,
  role: String,
  status: String,
  category: String,
  isActive: Boolean,
  firebaseUid: String,
}, { timestamps: true });

const Member = mongoose.model('Member', MemberSchema);

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const users = [
      {
        fullName: 'System Administrator',
        email: 'admin@scpsn.org.ng',
        phoneNumber: '08012345678',
        membershipId: 'ADMIN-001',
        role: 'admin',
        status: 'Active',
        category: 'Full',
        isActive: true,
        firebaseUid: 'mock-admin-uid',
      },
      {
        fullName: 'Test Member',
        email: 'member@scpsn.org.ng',
        phoneNumber: '08098765432',
        membershipId: 'MEM-001',
        role: 'regular',
        status: 'Active',
        category: 'Full',
        isActive: true,
        firebaseUid: 'mock-member-uid',
      }
    ];

    for (const user of users) {
      const existing = await Member.findOne({ email: user.email });
      if (existing) {
        console.log(`User ${user.email} already exists, updating...`);
        await Member.updateOne({ email: user.email }, user);
      } else {
        console.log(`Creating user ${user.email}...`);
        await Member.create(user);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
