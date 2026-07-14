require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create a dummy PDF file (we need it to have some minimal PDF header)
const dummyPdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(15 * 1024 * 1024, 'a')]);

cloudinary.uploader.upload_stream(
  { resource_type: 'video', folder: 'test' },
  (error, result) => {
    if (error) console.error("upload_stream video Error:", error);
    else console.log("upload_stream video Success:", result.secure_url);
  }
).end(dummyPdf);
