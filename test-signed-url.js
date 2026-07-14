require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const url = cloudinary.utils.url("digests/ufibany5ahwvkib83bix.pdf", { sign_url: true, type: "upload" });
console.log(url);
