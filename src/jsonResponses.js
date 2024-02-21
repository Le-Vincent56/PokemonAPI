// Imports
const fs = require('fs');

// Create an object in memory
const pokedex = fs.readFileSync(`${__dirname}/../data/pokedex.json`);

const respondJSON = (request, response, status, object) => {
  const headers = { 'Content-Type': 'application/json' };

  // Send the respones with the JSON object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = { 'Content-Type': 'application/json' };

  // Send response without the object
  response.writeHead(status, headers);
  response.end();
};

const getPokedex = (request, response) => {
  // Create the JSON object to send
  const responseJSON = JSON.parse(pokedex);

  // Return with success
  return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
  // Create an error response
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  // Return an error status with the message
  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  // Return a 404 status code
  respondJSONMeta(request, response, 404);
};

// Exports
module.exports = {
  getPokedex,
  notFound,
  notFoundMeta,
};
