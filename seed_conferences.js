const mongoose = require('mongoose');
const { Schema } = mongoose;

const uri = "mongodb+srv://scpc-backend:scpc-backend@scpc-backend.ru6a04k.mongodb.net/?appName=scpc-backend";

const ConferenceSchema = new Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: String,
  venue: String,
  bannerImage: String,
  status: { type: String, default: 'upcoming' },
  pricing: [Object],
  registrationOpen: Boolean,
  abstractSubmissionOpen: Boolean
}, { timestamps: true });

const Conference = mongoose.model('Conference', ConferenceSchema);

const seed = async () => {
  await mongoose.connect(uri);
  console.log('Connected to DB');

  const conf1 = {
    title: "Official Inaugural Launch of the IAC Alumni Network",
    description: "The Official Inaugural Launch of the IAC Alumni Network. This is not just a launch it is the beginning of building a formidable and globally respected faculty of IAC professionals across Africa.\n\nWHAT TO EXPECT:\n✅ Continuous Professional Development (CPD) programs\n✅ Specialized thematic trainings and management development sessions\n✅ Formation of focused research and innovation groups\n✅ International collaborations and networking",
    startDate: new Date("2026-08-01"), // Assuming future date for upcoming
    endDate: new Date("2026-08-01"),
    status: 'upcoming',
    registrationOpen: true,
    abstractSubmissionOpen: false,
    bannerImage: "https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg" // default
  };

  const conf2 = {
    title: "SCPSN CT (IAC) & CT (ASCP) Mentorship Training Program 2026",
    description: "LAST CALL: FEW SLOTS REMAINING!\n\nJoin the SCPSN CT (IAC) & CT (ASCP) Mentorship Training Program 2026 Before Registration Closes!\nThe countdown has begun! Medical laboratory Scientist, cytoscientists, Histoscientists and aspiring Cytotechnologist across Nigeria and beyond are already securing their spots in this intensive mentorship and board examination preparation class.\nLearn directly from experienced faculty experts, strengthen your diagnostic skills, and prepare confidently for the CT (IAC) and CT (ASCP) Board Examinations.\n\nFrom female genital tract Cytology to FNAC, Respiratory cytology, body fluids, HPV Pathogenesis, ROSE, EUS/EBUS, Quality management, and more.",
    startDate: new Date("2026-07-01"), // Assuming future date
    endDate: new Date("2026-10-01"),
    status: 'upcoming',
    registrationOpen: true,
    abstractSubmissionOpen: false,
    bannerImage: "https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg" // Will update if I can find the banner image in the repo
  };

  await Conference.deleteMany({ title: { $in: [conf1.title, conf2.title] } });
  
  await Conference.create(conf1);
  await Conference.create(conf2);
  
  console.log('Database seeded with conferences');
  mongoose.connection.close();
};

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
