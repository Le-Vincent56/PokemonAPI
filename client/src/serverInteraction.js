const handleResponse = async (response, parseResponse) => {
    // Determine the result of the given status responses
    switch(response.status)
    {
      case 200:
        // Success
        break;
        
      case 201:
        // Created
        break;

      case 204:
        // Updated data
        break;

      case 400:
        // Bad request
        break;

      case 404:
        // Resource not found
        break;

      default:
        // Status code not implemented
        break;
    }

    // Check if we should parse a response
    if(parseResponse)
    {
      // Parse the response to JSON
      let obj = await response.json();

      // Return the object
      return obj;

    } else {
      // State that meta data was received if a response should not be parsed
      content.innerHTML += '<p>Meta Data Received</p>';

      return null;
    }
};

export {handleResponse}