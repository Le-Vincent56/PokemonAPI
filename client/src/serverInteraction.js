const handleResponse = async (response, parseResponse) => {
  // Get the status container
  const statusContainer = document.querySelector('#status-container');

  // Determine the result of the given status responses
  switch(response.status)
  {
    case 200:
      // Success
      statusContainer.innerHTML = '<p id="status-message-success"><b>Success!</b></p>'
      break;
        
    case 201:
      // Created
      statusContainer.innerHTML = '<p id="status-message-success"><b>Created!</b></p>'
      break;

    case 204:
      // Updated data - doesn't ever parse, so returns after
      statusContainer.innerHTML = '<p id="status-message-updated"><b>Updated!</b></p>'
      break;

    case 400:
      // Bad request - doesn't ever parse, so returns after
      statusContainer.innerHTML = '<p id="status-message-failed"><b>Bad Request!</b></p>'
      break;

    case 404:
      // Resource not found - doesn't ever parse, so returns after
      statusContainer.innerHTML = '<p id="status-message-failed"<b>>Not Found!</b></p>'
      break;

    default:
      // Status code not implemented
      statusContainer.innerHTML = '<p id="status-message-failed"><b>Status Code Not Implemented!</b></p>'
      break;
  }

  // Check if we should parse a response
  if(parseResponse)
  {
    // Parse the response to JSON
    let obj = await response.json();

    if(obj["message"])
    {
      statusContainer.innerHTML += `<p id="status-message">${obj["message"]}</p>`
    }

    // Return the object
    return obj;

  } else {
    return null;
  }
};

export {handleResponse}