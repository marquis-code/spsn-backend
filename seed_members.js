const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const seedMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const db = mongoose.connection.db;
    
    // Read the members list
    const data = JSON.parse(fs.readFileSync('../membersList.json', 'utf8'));
    const membersList = data.members;
    
    console.log(`Found ${membersList.length} members in the JSON file.`);
    
    const formattedMembers = membersList.map((m, index) => {
      // Ensure email exists since it's required and unique
      let email = m.email_address;
      if (!email || email.trim() === '') {
        email = `noemail_${m.serial_number || index}@scpsn-placeholder.com`;
      }
      
      // Clean up phone number (some have '#ERROR!' or numbers)
      let phone = m.phone_no ? String(m.phone_no) : '';
      if (phone === '#ERROR!') phone = '';
      
      return {
        fullName: m.name || 'Unknown',
        email: email.toLowerCase().trim(),
        phoneNumber: phone,
        membershipId: m.rf_ra || '',
        role: 'regular',
        status: 'Active',
        category: 'Full',
        isBoardMember: false,
        isActive: true,
        enrollmentInfo: {
          membershipType: 'New',
          paymentStatus: 'Verified',
          enrollmentDate: new Date()
        },
        // We can store original unstructured data here if needed, but we'll stick to schema
      };
    });
    
    // Filter out duplicates by email just in case the JSON has duplicates
    const uniqueMembersMap = new Map();
    formattedMembers.forEach(m => {
      if (!uniqueMembersMap.has(m.email)) {
        uniqueMembersMap.set(m.email, m);
      }
    });
    const uniqueMembers = Array.from(uniqueMembersMap.values());
    console.log(`Prepared ${uniqueMembers.length} unique members for insertion.`);
    
    // Drop existing members collection just to be clean and avoid duplicate key errors
    const collections = await db.listCollections().toArray();
    if (collections.some(col => col.name === 'members')) {
      await db.dropCollection('members');
      console.log('Dropped existing members collection.');
    }
    
    // Insert new members using raw driver to bypass mongoose validation if anything strictly fails, 
    // or just use insertMany. We'll use the raw collection for speed and simplicity.
    const result = await db.collection('members').insertMany(uniqueMembers);
    
    console.log(`Successfully seeded ${result.insertedCount} members.`);
    
  } catch (error) {
    console.error('Error seeding members:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  }
};

seedMembers();
