// Imports
const fs = require('fs');

// Declare index style sheet
const main = fs.readFileSync(`${__dirname}/../client/src/main.js`);

const getMainJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(main);
  response.end();
};

const getJSFile = (request, response, fileName) => {
    const file = fs.readFileSync(`${__dirname}/../client/${fileName}`);
    response.writeHead(200, { 'Content-Type': 'text/javascript'});
    response.write(file);
    response.end();
}

// Exports
module.exports.getMainJS = getMainJS;
module.exports.getJSFile = getJSFile;