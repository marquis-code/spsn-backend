const https = require('https');
https.get('https://res.cloudinary.com/dt2xipxai/raw/upload/v1784028580/digests/aeev94ecwk9bgjvdoiaq', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
  res.on('data', (d) => process.stdout.write('data '));
}).on('error', (e) => {
  console.error('ERROR:', e);
});
