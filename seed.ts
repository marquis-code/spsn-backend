import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const ConferenceSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: String,
  venue: String,
  bannerImage: String,
  status: String,
  pricing: Array,
  registrationOpen: Boolean,
  abstractSubmissionOpen: Boolean,
}, { timestamps: true });

const Conference = mongoose.model('Conference', ConferenceSchema);

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/scpsn';
  await mongoose.connect(uri);
  
  await Conference.create({
    title: 'International Academy of Cytology (IAC) CT(IAC) Examination',
    description: 'The exam in Nigeria is now on the exam schedule. Please be at the Federal Medical Center punctually for sign-in and questions at 8:00AM. If there are no problems, it is planned to finish the exams after five hours with a short break. Deadline for applications to be approved at this office is 1. July 2026.',
    startDate: new Date('2026-07-01T08:00:00Z'),
    endDate: new Date('2026-07-01T13:00:00Z'),
    location: 'Federal Medical Center ICT room, No. 1 Anwai road, PMB 1033, Asaba, Delta State, Nigeria',
    venue: 'Federal Medical Center',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    status: 'upcoming',
    pricing: [],
    registrationOpen: true,
    abstractSubmissionOpen: false
  });
  
  console.log('Seeded conference event successfully!');
  await mongoose.disconnect();
}
seed().catch(console.error);
