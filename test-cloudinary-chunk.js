require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 15MB dummy file
const dummyFile = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(15 * 1024 * 1024, 'a')]);

cloudinary.uploader.upload_chunked_stream(
  { resource_type: 'raw', folder: 'test', chunk_size: 6000000 },
  (error, result) => {
    if (error) console.error("upload_chunked_stream Error:", error);
    else console.log("upload_chunked_stream Success:", result.secure_url);
  }
).end(dummyFile);
