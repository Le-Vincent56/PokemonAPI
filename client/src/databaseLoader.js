import * as serverInteraction from './serverInteraction.js'

const init = async () => {
    loadSpritePage(0);
}

const loadSpritePage = async (pageNum) => {
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
        loadDisplay(obj, pageNum);
    }
}

const loadDisplay = async (spriteIDs, pageNum) => {
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
        const pageToNumPokemon = {
            0: {min: 0, max: 151, total: 151},
            1: {min: 151, max: 251, total: 100},
            2: {min: 251, max: 386, total: 135},
            3: {min: 386, max: 493, total: 107},
            4: {min: 493, max: 649, total: 156},
            5: {min: 649, max: 721, total: 72},
            6: {min: 721, max: 809, total: 88}
        };

        // Get the section to display
        const displaySection = document.querySelector("#available-pokemon");

        // Clear the display section
        displaySection.innerHTML = "";
        
        // Loop through the keys and create divs for each
        for(let i = pageToNumPokemon[pageNum].min; i < pageToNumPokemon[pageNum].max; i++)
        {
            let imgSrc = `/media/sprites/${spriteIDs[i + 1]}`;

            displaySection.innerHTML += 
            `<div class='pokemon-display'>
            <img src=${imgSrc.substring(1)} alt='${obj[i].name.english} Game Sprite'>
            <p>${obj[i].name.english}</p>
            </div>
            `;

            //getSpriteFile(`sprite=${spriteIDs[i + 1]}`);
        }

        // Get the number of boxes to add as empty space
        let originalNum = pageToNumPokemon[pageNum].total;

        // Add enough boxes to create nice even spacings of 6
        while(originalNum % 6 !== 0)
        {
            // Increment original Num
            originalNum++;

            // Add an empty last one to create nice spacing
            displaySection.innerHTML += `<div class='pokemon-display'></div>`;
        }
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