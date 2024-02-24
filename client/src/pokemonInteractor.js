import * as serverInteraction from './serverInteraction.js'

const getPokemonInfo = async (id) => {
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
        // Use the sprite IDs to load
        setPokemonInfo(obj, id);
    }
}

const setPokemonInfo = async (spriteSheet, id) => {
    // Request the pokedex database
    let response = await fetch('/data/pokedex.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null) {
        const infoSpace = document.querySelector('#pokemon-information');

        // Clear the last one
        infoSpace.innerHTML = '';

        let finalHTML = '';

        finalHTML += 
        `<div id='general-info'>
            <div id='name-header'>
                <h1>${obj[id].name.english}</h1>
            </div>
            <div id='pokemon-img'>
                <img src=/getIMG?sprite=${spriteSheet[Number(id) + 1]}>
            </div>
            <div id='type-info'>
        `;

        for(let i = 0; i < obj[id].type.length; i++) {
            finalHTML += `<p>${obj[id].type[i]}</p>`
        }

        finalHTML += 
        `
            </div>
        </div>
        `;

        infoSpace.innerHTML = finalHTML;
    }
}

export {getPokemonInfo}