// Imports
const fs = require('fs');

// Declare index style sheet
const index = fs.readFileSync(`${__dirname}/../client/styles/style.css`);

const getIndexStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(index);
  response.end();
};

// Exports
module.exports.getIndexStyle = getIndexStyle;
