import * as serverInteraction from './serverInteraction.js'

const init = async () => {
    // Request the pokedex database
    let response = await fetch('/data/pokedex.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Wait fort the server to handle the response
    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {
        // Handle the object
        console.log(obj);
        
        // Get the section to display
        const displaySection = document.querySelector("#available-pokemon");
        
        // Loop through the keys and create divs for each
        for(let i = 0; i < Object.keys(obj).length; i++)
        {
            displaySection.innerHTML += 
            `<div class='pokemon-display'><p>Pokemon${i + 1}</p>
            </div>
            `;
        }
        // Add an empty last one to create nice spacing
        displaySection.innerHTML += `<div class='pokemon-display'></div>`;
    }
}

export {init}