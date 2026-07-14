const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const digest = await db.collection('digests').findOne({});
  console.log('PDF URL IN DB:', digest.pdfUrl);
  process.exit(0);
});
