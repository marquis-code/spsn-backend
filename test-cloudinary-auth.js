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
  page.drawText('Test authenticated pdf upload');
  const pdfBytes = await newPdf.save();

  cloudinary.uploader.upload_stream(
    { resource_type: 'image', type: 'authenticated', folder: 'test', public_id: 'test_auth.pdf' },
    (error, result) => {
      if (error) console.error("upload Error:", error);
      else {
        console.log("upload Success:", result.public_id);
        const url = cloudinary.utils.url(result.public_id, { sign_url: true, type: "authenticated", resource_type: "image" });
        console.log("Signed URL:", url);
      }
    }
  ).end(pdfBytes);
}

run();
