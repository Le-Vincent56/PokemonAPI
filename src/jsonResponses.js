// Imports
const fs = require('fs');

// Current team
const currentTeam = {};

// Create an object in memory
const pokedex = fs.readFileSync(`${__dirname}/../data/pokedex.json`);
const spriteIDs = fs.readFileSync(`${__dirname}/../data/spriteIDs.json`);
const imageIDs = fs.readFileSync(`${__dirname}/../data/imageIDs.json`);

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

const getSpriteIDs = (request, response) => {
  // Create the JSON object to send
  const responseJSON = JSON.parse(spriteIDs);

  // Return with success
  return respondJSON(request, response, 200, responseJSON);
};

const getImageIDs = (request, response) => {
  // Create the JSON object to send
  const responseJSON = JSON.parse(imageIDs);

  // Return with success
  return respondJSON(request, response, 200, responseJSON);
};

const getTeam = (request, response, params) => {
  const returnTeam = currentTeam[params];
  console.log(JSON.stringify(returnTeam));

  if(!returnTeam)
  {
    let responseJSON = {
      message: 'Team does not exist',
      id: 'nullTeam'
    }

    return respondJSON(request, response, 404, responseJSON);
  }

  // Return the JSON team object
  respondJSON(request, response, 200, returnTeam);
};

const updateTeam = (request, response, data) => {
  // Create a response
  const responseJSON = {
    message: 'Team created successfully',
    id: 'teamCreatedSuccess',
  };

  // Parse the data into an object
  const givenTeam = {
    name: data.name,
    pokemon: data.pokemon,
  };

  // Check if a pokemon name is given
  if(!givenTeam.name || !givenTeam.name === "") {
    responseJSON.message = 'Team name is required';
    responseJSON.id = 'addTeamMissingName';

    // Return with a bad request
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if a pokemon team is given
  if (!givenTeam.pokemon) {
    responseJSON.message = 'Pokemon team is required';
    responseJSON.id = 'addTeamNoPokemon';

    // Return with a bad request
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if a user with the given name already exists
  if (currentTeam[givenTeam.name]) {
    // Check if the team is different
    if (currentTeam[givenTeam.name].pokemon !== givenTeam.pokemon) {
      // Update the age
      currentTeam[givenTeam.name].pokemon = givenTeam.pokemon;

      // Return with no content status
      return respondJSONMeta(request, response, 204);
    }
  }

  // Create a new user with the given data
  currentTeam[givenTeam.name] = {};
  currentTeam[givenTeam.name].name = givenTeam.name;
  currentTeam[givenTeam.name].pokemon = givenTeam.pokemon;

  // Return with a created status
  return respondJSON(request, response, 201, responseJSON);
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
  getSpriteIDs,
  getImageIDs,
  getTeam,
  updateTeam,
  notFound,
  notFoundMeta,
};
