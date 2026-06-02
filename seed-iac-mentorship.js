const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scpsn');
  const db = mongoose.connection;
  const conferencesCollection = db.collection('conferences');

  const title = "SCPSN CT (IAC) & CT (ASCP) Mentorship Training Program 2026";
  const description = `LAST CALL: FEW SLOTS REMAINING! 

Join the SCPSN CT (IAC) & CT (ASCP) Mentorship Training Program 2026 Before Registration Closes! 

The countdown has begun!
Medical laboratory Scientist, cytoscientists, Histoscientists and aspiring Cytotechnologist across Nigeria and beyond are already securing their spots in this intensive mentorship and board examination preparation class.
Don't forget this is your opportunity to learn directly from experienced faculty experts,strengthen your diagnostic skills, and prepare confidently for the CT (IAC) and CT (ASCP) Board Examinations.

From female genital tract Cytology to FNAC, Respiratory cytology,body fluids, HPV Pathogenesis, ROSE, EUS/EBUS, Quality management,and more.This comprehensive training is designed to sharpen both your theory and practical understanding.

Pls note! Registration is ongoing, but available slots are rapidly filling out!
Don’t wait until the final announcement closes enroll Now and enjoy new height.What to expect!!

✅ Online & On-site Training
✅ Mentorship by Experts
✅ Comprehensive cytology review
✅ International Board Examination Preparation
✅ Career boosting Opportunity

Secure your space now and join the next generation of Cytology professionals!

📌 Hosted by: Society of Cellular Pathology Scientists of Nigeria Delta State
📧 Enquiries: thescpsn@gmail.com
📞 08078322019 | 08033644031 | 

REGISTER NOW,BEFORE THE REMAINING SLOTS ARE FILLED!`;

  // Set default dates
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + 2); // 2 months from now
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 14); // 2 weeks training

  const existing = await conferencesCollection.findOne({ title });
  if (existing) {
    await conferencesCollection.updateOne(
      { title },
      { $set: { description, startDate, endDate, location: 'Delta State / Online', venue: 'Online & On-site', updatedAt: new Date() } }
    );
    console.log('Updated existing SCPSN CT Mentorship Training Program conference');
  } else {
    await conferencesCollection.insertOne({
      title,
      description,
      startDate,
      endDate,
      location: 'Delta State / Online',
      venue: 'Online & On-site',
      bannerImage: 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg', // Placeholder
      status: 'upcoming',
      pricing: [],
      registrationOpen: true,
      abstractSubmissionOpen: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Created new SCPSN CT Mentorship Training Program conference');
  }
  
  await mongoose.disconnect();
}
run().catch(console.error);
