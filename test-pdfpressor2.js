const { compressPdf } = require('pdfpressor');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function test() {
  const newPdf = await PDFDocument.create();
  const page = newPdf.addPage([500, 500]);
  page.drawText('Hello World');
  const pdfBytes = await newPdf.save();
  fs.writeFileSync('test.pdf', pdfBytes);

  await compressPdf('test.pdf', 'test_out.pdf', 100, 60, true);
  console.log('out size:', fs.statSync('test_out.pdf').size);
}
test().catch(console.error);
