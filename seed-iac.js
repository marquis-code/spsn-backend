const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scpsn');
  const db = mongoose.connection;
  const conferencesCollection = db.collection('conferences');

  const title = "The Official Inaugural Launch of the IAC Alumni Network";
  const description = `ONE OF THE BIGGEST HIGHLIGHTS OF THE SCPSN CONFERENCE IS HERE!!!! 

INTRODUCING THE OFFICIAL INAUGURAL LAUNCH OF IAC ALUMNI NETWORK 

The Official Inaugural Launch of the IAC Alumni Network.This is not just a launch it is the beginning of building a formidable and globally respected faculty of IAC professionals across Africa 🌍
The IAC Alumni launch is designed to connect brilliant minds,strengthen professional relevance, and create endless opportunities for growth, collaboration,mentorship, leadership, and international recognition.

WHAT TO EXPECT: 
✅ Continuous Professional Development (CPD) programs to keep members globally relevant
✅ Specialized thematic trainings and management development sessions
✅ Formation of focused research and innovation groups
✅ International collaborations and networking opportunities
✅ Mentorship and career advancement platforms
✅ Exposure to high-impact leadership opportunities
✅ Access to a strong professional community that keeps you ahead in your field
✅ Strategic sessions designed to make professionals unstoppable in their careers

This is not  one of those conferences,this is a conference that will shape the future of African professionals globally 
If you are yet to register for the IAC Mentorship Exams, THIS is your sign! The faculty is introducing bigger opportunities,stronger platforms, and career-transforming initiatives that every aspiring professional should be part of.
Becoming an IAC Professional means becoming part of a network that equips you for relevance, visibility, excellence, and international impact. 
And for all existing IAC Professionals…
Get ready! Prepare for an unforgettable conference experience and be part of history at the inaugural IAC Alumni launch.The future is being built NOW, and you deserve a seat at the table. 

Don’t miss this opportunity to grow, connect, lead, and soar higher in your profession. 🚀🔥`;

  // Set default dates to 1 month from now since none were provided
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const existing = await conferencesCollection.findOne({ title });
  if (existing) {
    await conferencesCollection.updateOne(
      { title },
      { $set: { description, startDate, endDate, updatedAt: new Date() } }
    );
    console.log('Updated existing IAC Alumni Network Launch conference');
  } else {
    await conferencesCollection.insertOne({
      title,
      description,
      startDate,
      endDate,
      location: 'To Be Announced',
      venue: 'To Be Announced',
      bannerImage: 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg',
      status: 'upcoming',
      pricing: [],
      registrationOpen: true,
      abstractSubmissionOpen: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Created new IAC Alumni Network Launch conference');
  }
  
  await mongoose.disconnect();
}
run().catch(console.error);
