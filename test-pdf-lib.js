const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function run() {
  const fileData = fs.readFileSync('test.pdf'); // We don't have a 20MB pdf here
}
run();
