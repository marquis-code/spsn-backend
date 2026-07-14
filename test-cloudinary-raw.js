require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const newPdf = await PDFDocument.create();
  const page = newPdf.addPage([500, 500]);
  page.drawText('Test raw pdf upload');
  const pdfBytes = await newPdf.save();

  cloudinary.uploader.upload_stream(
    { resource_type: 'raw', folder: 'test' },
    (error, result) => {
      if (error) console.error("upload_stream raw Error:", error);
      else console.log("upload_stream raw Success:", result.secure_url);
    }
  ).end(pdfBytes);
}

run();
