// Imports
const fs = require('fs');

const respondIMG = (request, response, status, obj) => {
  response.writeHead(status, { 'Content-Type': 'image/png' });
  response.write(obj);
  response.end();
};

const getSpriteFile = (request, response, params) => {
  if (!params.sprite || params.sprite === undefined) {
    const responseJSON = {
      message: 'Missing valid query parameter set to true',
      id: 'badIMGRequest',
    };

    // Return our json with a 400 bad request code
    return respondIMG(request, response, 400, responseJSON);
  }

  const responseJSON = {};
  responseJSON.file = fs.readFileSync(`${__dirname}/../client/media/sprites/${params.sprite}`);
  responseJSON.message = `Retrieved Sprite: ${params.sprite}`;
  responseJSON.id = 'retrievedSprite';
  return respondIMG(request, response, 200, responseJSON.file);
};

const getImageFile = (request, response, params) => {
  if (!params.image || params.image === undefined) {
    const responseJSON = {
      message: 'Missing valid query parameter set to true',
      id: 'badIMGRequest',
    };

    // Return our json with a 400 bad request code
    return respondIMG(request, response, 400, responseJSON);
  }

  const responseJSON = {};
  responseJSON.file = fs.readFileSync(`${__dirname}/../client/media/images/${params.image}`);
  responseJSON.message = `Retrieved Sprite: ${params.sprite}`;
  responseJSON.id = 'retrievedImage';
  return respondIMG(request, response, 200, responseJSON.file);
};

// Exports
module.exports.getSpriteFile = getSpriteFile;
module.exports.getImageFile = getImageFile;
