// Imports
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const cssHandler = require('./cssResponses.js');
const jsonHandler = require('./jsonResponses.js');
const jsHandler = require('./jsResponses.js');
const imgHandler = require('./imgResponses.js');

// Establish port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndexPage,
    '/styles/style.css': cssHandler.getIndexStyle,
    '/src/main.js': jsHandler.getMainJS,
    '/src/serverInteraction.js': jsHandler.getJSFile,
    '/src/uiEffects.js': jsHandler.getJSFile,
    '/src/databaseLoader.js': jsHandler.getJSFile,
    '/data/pokedex.json': jsonHandler.getPokedex,
    '/data/spriteIDs.json': jsonHandler.getSpriteIDs,
    '/getIMG': imgHandler.getIMGFile,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {

  },
};

// Server functions
const parseBody = (request, response, handler) => {
  // Create a container for the data
  const body = [];

  // If there's an error, throw it
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Add the data to the body as it comes in
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // On end, parse the full body and post the data
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  // Parse the URL
  const parsedURL = url.parse(request.url);
  const params = query.parse(parsedURL.query)

  // Check if the URL struct contains the request method
  if (!urlStruct[request.method]) {
    // If not, return the HEAD's not found response
    return urlStruct.HEAD.notFound(request, response);
  }

  // Check if the pathname exists within the URL struct's
  // request method object
  if (urlStruct[request.method][parsedURL.pathname]) {
    if (request.method === 'POST') {
      // Parse the data being uploaded
      return parseBody(request, response, urlStruct[request.method][parsedURL.pathname]);
    }

    // Get requests for .js files
    if (request.method === 'GET' && parsedURL.pathname.substring(0, 5) === '/src/') {
      return urlStruct[request.method][parsedURL.pathname](request, response, parsedURL.pathname);
    }

    if(request.method === 'GET' && parsedURL.pathname === "/getIMG") {
      return urlStruct[request.method][parsedURL.pathname](request, response, params)
    }

    // Return the path's response
    return urlStruct[request.method][parsedURL.pathname](request, response);
  }

  // Return not found it no method is found
  return urlStruct[request.method].notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
