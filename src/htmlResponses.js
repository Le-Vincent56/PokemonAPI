// Imports
const fs = require('fs');

// Get the index page
const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// Server functions
const getIndexPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Exports
module.exports.getIndexPage = getIndexPage;
