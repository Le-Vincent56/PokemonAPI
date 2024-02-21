// Create an object in memory
const users = {};

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

const getUsers = (request, response) => {
  // Create the JSON object to send
  const responseJSON = {
    message: JSON.stringify(users),
  };

  // Return with success
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
  // Return with success
  respondJSONMeta(request, response, 200);
};

const updateUser = (request, response, data) => {
  // Create a response
  const responseJSON = {
    message: 'User created successfully',
    id: 'userCreatedSuccess',
  };

  // Parse the data into an object
  const newUser = {
    name: data.name,
    age: data.age,
  };

  // Check if both a name and age were given
  if (!newUser.name || !newUser.age) {
    responseJSON.message = 'Name and age are both required to add or update an existing user';
    responseJSON.id = 'addUserMissingParams';

    // Return with a bad request
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if a user with the given name already exists
  if (users[newUser.name]) {
    // Check if the age is different
    if (users[newUser.name].age !== newUser.age) {
      // Update the age
      users[newUser.name].age = newUser.age;

      // Return with no content status
      return respondJSONMeta(request, response, 204);
    }
  }

  // Create a new user with the given data
  users[newUser.name] = {};
  users[newUser.name].name = newUser.name;
  users[newUser.name].age = newUser.age;

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
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
