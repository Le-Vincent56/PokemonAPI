import * as serverInteraction from './serverInteraction.js'

const init = async () => {
    loadSpriteIDs();
}

const loadSpriteIDs = async () => {
    let response = await fetch('/data/spriteIDs.json', {
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

        // Use the sprite IDs to load
        loadDisplay(obj);
    }
}

const loadDisplay = async (spriteIDs) => {
    // Request the pokedex database
    let response = await fetch('/data/pokedex.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Wait for the server to handle the response
    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {
        // Handle the object
        console.log(obj);
        
        // Get the section to display
        const displaySection = document.querySelector("#available-pokemon");

        // Clear the display section
        displaySection.innerHTML = "";
        
        // Loop through the keys and create divs for each
        for(let i = 0; i < Object.keys(obj).length; i++)
        {
            let imgSrc = `/media/${spriteIDs[i + 1]}`;

            displaySection.innerHTML += 
            `<div class='pokemon-display'>
            <img src=${imgSrc.substring(1)} alt='${obj[i].name.english} Sprite'>
            <p>${obj[i].name.english}</p>
            </div>
            `;

            getSpriteFile(`sprite=${spriteIDs[i + 1]}`);
        }

        // Add an empty last one to create nice spacing
        displaySection.innerHTML += `<div class='pokemon-display'></div>`;
    }
}

const getSpriteFile = async (query) => {
    let response = await fetch(`/getIMG?${query}`, {
        method: 'GET',
        headers: {
            'Accept': 'image/png'
        }
    });

    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {
        // Handle the object
        console.log(obj);
    }
}

export {init}