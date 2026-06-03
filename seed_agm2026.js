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
  abstractSubmissionOpen: Boolean,
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Conference = mongoose.model('Conference', ConferenceSchema);

const seed = async () => {
  await mongoose.connect(uri);
  console.log('Connected to DB');

  const conf = {
    title: "SCPSN 9th International Conference/AGM 2026",
    description: "Theme: EXPLORING THE LIVER-PANCREAS AXIS: INTERSECTING PATHWAYS IN DEVELOPMENT, DISEASE AND NEOPLASIA.\n\nSub themes include Embryology to Oncology, Ampullary Tumours, Metastatic Disease mimics, Systemic diseases with Pancreatobiliary manifestations, Ancillary techniques, AI applications, etc.\n\nRegistration: Nigeria - 30,000, Africa - $50, Beyond Africa - $100.",
    startDate: new Date("2026-07-15T08:00:00"),
    endDate: new Date("2026-07-18T18:00:00"),
    location: "Asaba, Delta State",
    venue: "Prof. Chikezie Edozien Secretariat, Asaba. Delta State",
    status: 'upcoming',
    registrationOpen: true,
    abstractSubmissionOpen: true,
    bannerImage: "", // Will be uploaded by admin later
    order: -1 // Highest priority
  };

  const existing = await Conference.findOne({ title: conf.title });
  if (existing) {
    await Conference.updateOne({ title: conf.title }, { $set: conf });
    console.log('Updated AGM 2026');
  } else {
    await Conference.create(conf);
    console.log('Created AGM 2026');
  }
  
  mongoose.connection.close();
};

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
