const { pdfpressor } = require('pdfpressor');
const fs = require('fs');

async function test() {
  // Let's create a dummy pdf first or just see if the library exports what we expect
  console.log(pdfpressor);
}
test();
