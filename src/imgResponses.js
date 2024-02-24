// Imports
const fs = require('fs');

const respondIMG = (request, response, status, obj) => {
    response.writeHead(status, { 'Content-Type': 'image/png' });
    response.write(obj);
    response.end();
}

const getIMGFile = (request, response, params) => {
    if(!params.sprite || params.sprite === undefined)
    {
      const responseJSON = {
        message: 'Missing valid query parameter set to true',
        id: 'badIMGRequest'
      };

      // Return our json with a 400 bad request code
      return respondIMG(request, response, 400, responseJSON);
    }

    const file = fs.readFileSync(`${__dirname}/../client/media/sprites/${params.sprite}`)
    return respondIMG(request, response, 200, file);
};

// Exports
module.exports.getIMGFile = getIMGFile;