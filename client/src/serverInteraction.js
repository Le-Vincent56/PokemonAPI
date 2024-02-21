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

const requestUpdateMethod = async (userForm) => {
    // Await the fetch response
    let response = await fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    });

    // Handle the response when fetched, parse if not a HEAD method call
    handleResponse(response, method === 'get');
};

const requestAddUser = async (nameForm) => {
    //Grab all the info from the form
    const nameAction = nameForm.getAttribute('action');
    const nameMethod = nameForm.getAttribute('method');
    
    const nameField = nameForm.querySelector('#nameField');
    const ageField = nameForm.querySelector('#ageField');

    //Build a data string in the FORM-URLENCODED format.
    const formData = `name=${nameField.value}&age=${ageField.value}`;

    //Make a fetch request and await a response.
    let response = await fetch(nameAction, {
      method: nameMethod,
      headers: {
        'Content-Type': 'application/x-www-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
    });

    //Once we have a response, handle it.
    handleResponse(response, true);
};

export {handleResponse}