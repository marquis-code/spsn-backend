const http = require('http');
const https = require('https');

http.createServer((req, res) => {
  if (req.url === '/pdf') {
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="test.pdf"'
    });
    // raw URL from task 298
    https.get('https://res.cloudinary.com/dt2xipxai/raw/upload/v1784027950/test/jugmywpwldfxqrwzrcte', (cloudinaryRes) => {
      cloudinaryRes.pipe(res);
    });
  } else {
    res.end('Hello');
  }
}).listen(3010, () => console.log('Listening on 3010'));
