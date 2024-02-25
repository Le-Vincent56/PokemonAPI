import * as ui from './uiEffects.js'
import * as serverInteraction from './serverInteraction.js'
import * as teamInteractor from './teamInteractor.js'

let showingInfo = false;

const getPokemonInfo = async (id, inTeam = false) => {
    // If clicking outside of the team, remove the ripples
    if(!inTeam)
    {
        // Remove ripples
        ui.removeRipples();
    }

    let response = await fetch('/data/imageIDs.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Wait for the server to handle the response
    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {
        // Use the sprite IDs to load
        setPokemonInfo(obj, id, inTeam);
    }
}

const setPokemonInfo = async (imageSheet, id, inTeam) => {
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

        if(infoSpace.innerHTML === '') {
            buildFromScratch(infoSpace, obj, imageSheet, id);
        } else {
            replaceInfo(obj, imageSheet, id, inTeam);
        }
    }
}

const clearPokemonInfo = () => {
    const informationContainer = document.querySelector("#pokemon-information")
    informationContainer.style.height = '0px'
    informationContainer.style.opacity = '0';
    showingInfo = false;

    // Unselect pokemon if one is selected
    const selectedPokemon = document.querySelector('.selected');
    if(selectedPokemon)
    {
        selectedPokemon.classList.remove('selected');
    }
}

const showPokemonInfo = () => {
    const informationContainer = document.querySelector("#pokemon-information")
    informationContainer.style.height = '900px'
    informationContainer.style.opacity = '1';
    showingInfo = true;
}

const buildFromScratch = (infoSpace, pokedex, imageSheet, id, inTeam) => {
    // Make space
    showPokemonInfo();

    // Create a final string
    let finalHTML = '';

    // Add the beginning structure - name and image
    finalHTML += 
    `<div id='general-info'>
        <div id='name-header'>
            <h1>${pokedex[id].name.english}</h1>
        </div>
        <div id='pokemon-img'>
            <img src=/getImage?image=${imageSheet[Number(id) + 1]}>
        </div>
        <div id='type-info'>
    `;

    // Add type info
    for(let i = 0; i < pokedex[id].type.length; i++) {
        finalHTML += `<p class='type-${pokedex[id].type[i].toLowerCase()}'>${pokedex[id].type[i]}</p>`
    }

    finalHTML += 
    `
        </div>
    `;

    // Begin pokemon stat structure
    finalHTML +=
    `   <div id='pokemon-stat-container'>
            <div id='pokemon-stats'>
        
    `;

    // Get the keys of the base stats
    const baseStatKeys = Object.keys(pokedex[id].base);

    // Iterate through each key
    for(let i = 0; i < Object.keys(pokedex[id].base).length; i++) {
        // Sanitize the key to be able to be used nicely for CSS
        const sanitizedStat = baseStatKeys[i].toLowerCase().replace(/[\s.]/g, '');

        // Fill in the base stat structure
        finalHTML += 
            `<div id='stat-${sanitizedStat}' class='stat-block'>
                <div class='stat-name-holder'>
                    <p class='stat-name'>${baseStatKeys[i]}</p>
                </div>
                <div class='stat-bar-length'>
                    <div class='stat-bar block-${sanitizedStat}'></div>
                </div>
                <p class='stat-num'>${pokedex[id].base[baseStatKeys[i]]}</p>
            </div>
        `;
    }

    finalHTML += 
    `
            </div>
    `;

    // Add the "Add" or "Remove" button
    if(inTeam) {
        finalHTML += 
    `    
        </div>
        <div id='button-container'>
            <p id='remove-btn'>Remove</p>
        </div>
    </div>
    `;
    } else {
        finalHTML += 
    `    
        </div>
        <div id='button-container'>
            <p id='add-btn'>Add</p>
        </div>
    </div>
    `;
    }    

    // Add the final HTML to the info space
    infoSpace.innerHTML = finalHTML;    

    // Calculate the widths of the bars
    const statBars = document.querySelectorAll('.stat-bar');
    const statNums = document.querySelectorAll('.stat-num');

    // Iterate through each stat
    for(let i = 0; i < statBars.length; i++) {
        // Calculate the base stat percentage
        const statNum = Number(statNums[i].innerHTML);

        // Highest stat is 255, so get a percentage to display
        statBars[i].style.width = `${(statNum/255) * 100}%`
    }

    // Update buttons
    updateButtons(pokedex, id);
}

const replaceInfo = (pokedex, imageSheet, id, inTeam) => {
    if(!showingInfo) {
        showPokemonInfo();
    }

    // Replace header
    const header = document.querySelector('#name-header');
    header.querySelector('h1').innerHTML = `${pokedex[id].name.english}`;

    // Replace image
    const image = document.querySelector('#pokemon-img');
    image.querySelector('img').src = `/getImage?image=${imageSheet[Number(id) + 1]}`;

    // Replace type info
    const typeInfo = document.querySelector('#type-info');
    let typeHTML = '';
    typeInfo.innerHTML = '';
    for(let i = 0; i < pokedex[id].type.length; i++) {
        typeHTML += `<p class='type-${pokedex[id].type[i].toLowerCase()}'>${pokedex[id].type[i]}</p>`
    }
    typeInfo.innerHTML = typeHTML;

    // Replace stat numbers
    const baseStatKeys = Object.keys(pokedex[id].base);
    const statNums = document.querySelectorAll('.stat-num');
    for(let i = 0; i < statNums.length; i++) {
        statNums[i].innerHTML = `${pokedex[id].base[baseStatKeys[i]]}`;
    }

    // Replace stat bars
    const statBars = document.querySelectorAll('.stat-bar');
    for(let i = 0; i < statBars.length; i++) {
        const statNum = Number(statNums[i].innerHTML);

        // Highest stat is 255, so get a percentage to display
        statBars[i].style.width = `${(statNum/255) * 100}%`
    }

    // Update buttons
    const buttonContainer = document.querySelector('#button-container');
    if(inTeam) {
        // Replace the Add button if it exists
        if(buttonContainer.querySelector('#add-btn')) {
            buttonContainer.innerHTML = '';
            buttonContainer.innerHTML = `<p id='remove-btn'>Remove</p>`
        }
    } else {
        // Replace the Remove button if it exists
        if(buttonContainer.querySelector('#remove-btn')) {
            buttonContainer.innerHTML = '';
            buttonContainer.innerHTML = `<p id='add-btn'>Add</p>`
        }
    }

    // Update buttons
    updateButtons(pokedex, id);
}

const updateButtons = async (pokedex, id) => {
    let response = await fetch('/data/spriteIDs.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Wait for the server to handle the response
    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {
        // Retrieve buttons
        const addBtn = document.querySelector('#add-btn');
        const removeBtn = document.querySelector('#remove-btn');

        // TODO: If the pokemon exists in the party, then highlight the remove button, otherwise
        // highlight the add button
        if(addBtn) {
            addBtn.onclick = () => { 
                teamInteractor.addToTeam(pokedex[id].name.english, id, `/getSprite?sprite=${obj[Number(id) + 1]}`)
            }
        }

        if(removeBtn) {
            removeBtn.onclick = () => {
                teamInteractor.removeFromTeam();
            }
        }
        
    }
}

export {getPokemonInfo, clearPokemonInfo}