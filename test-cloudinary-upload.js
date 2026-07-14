require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create a 15MB dummy file
const dummyFile = Buffer.alloc(15 * 1024 * 1024, 'a');

cloudinary.uploader.upload_stream(
  { resource_type: 'raw', folder: 'test' },
  (error, result) => {
    if (error) console.error("upload_stream Error:", error);
    else console.log("upload_stream Success:", result.secure_url);
  }
).end(dummyFile);

cloudinary.uploader.upload_chunked_stream(
  { resource_type: 'raw', folder: 'test' },
  (error, result) => {
    if (error) console.error("upload_chunked_stream Error:", error);
    else console.log("upload_chunked_stream Success:", result.secure_url);
  }
).end(dummyFile);
