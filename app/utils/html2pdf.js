const html_to_pdf = require('html-pdf-node');

let options = { format: 'A4' };

let file = { content: "<h1>Welcome to html-pdf-node</h1>" };

html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    console.log("PDF Buffer:-", pdfBuffer);
});