import * as serverInteraction from './serverInteraction.js'
import * as ui from './uiEffects.js'
import * as interactor from './pokemonInteractor.js'

let page = 0;
const pageToNumPokemon = {
    0: {min: 0, max: 151, total: 151},
    1: {min: 151, max: 251, total: 100},
    2: {min: 251, max: 386, total: 135},
    3: {min: 386, max: 493, total: 107},
    4: {min: 493, max: 649, total: 156},
    5: {min: 649, max: 721, total: 72},
    6: {min: 721, max: 809, total: 88}
};

const init = async () => {
    initButtons();
    loadSpritePage(page);
};

const initButtons = () => {
    const prevBtn = document.querySelector('#prev-gen');
    const nextBtn = document.querySelector('#next-gen');

    const changePage = (change) => {
        page += change;

        loadSpritePage(page);
    }

    prevBtn.onclick = (e) => {
        // Decrement page to a minimum of 0
        if(page !== 0) {
            changePage(-1);
        }

        // Update the buttons
        updateButtonVisibility();
    }

    nextBtn.onclick = (e) => {
        // Increment page to a maximum of 6
        if(page !== 6) {
            changePage(1);
        }

        // Update the buttons
        updateButtonVisibility();
    }

    // Update button visibility
    updateButtonVisibility();
}

const updateButtonVisibility = () => {
    const prevBtn = document.querySelector('#prev-gen');
    const nextBtn = document.querySelector('#next-gen');

    if(page === 0) {
        prevBtn.querySelector('.btn-overlay').classList.remove('active-btn');
        prevBtn.querySelector('.btn-overlay').classList.add('inactive-btn');
    } else {
        prevBtn.querySelector('.btn-overlay').classList.add('active-btn');
        prevBtn.querySelector('.btn-overlay').classList.remove('inactive-btn');
    }

    if(page === 6) {
        nextBtn.querySelector('.btn-overlay').classList.remove('active-btn');
        nextBtn.querySelector('.btn-overlay').classList.add('inactive-btn');
    } else {
        nextBtn.querySelector('.btn-overlay').classList.add('active-btn');
        nextBtn.querySelector('.btn-overlay').classList.remove('inactive-btn');
    }
};

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
        // Use the sprite IDs to load
        loadDisplay(obj, pageNum);
    }
};

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
        // Get the section to display
        const displaySection = document.querySelector("#available-pokemon");

        // Clear the display section
        displaySection.innerHTML = "";
        
        // Loop through the keys and create divs for each
        for(let i = pageToNumPokemon[pageNum].min; i < pageToNumPokemon[pageNum].max; i++)
        {
            // Get the src
            let imgSrc = `/getSprite?sprite=${spriteIDs[i + 1]}`;

            // Assign HTML
            displaySection.innerHTML += 
            `<div id='dex-${i}' class='pokemon-display'>
            <img src=${imgSrc} alt='${obj[i].name.english} Game Sprite' class='game-sprite'>
            <p class='hover-name-text'>${obj[i].name.english}</p>
            <div class='overlay'></div>
            <div class='select-effect'></div>
            <div class='display-background'></div>
            </div>
            `;
        }

        // Get the number of boxes to add as empty space
        let originalNum = pageToNumPokemon[pageNum].total;

        // Add enough boxes to create nice even spacings of 6
        while(originalNum % 9 !== 0)
        {
            // Increment original Num
            originalNum++;

            // Add an empty last one to create nice spacing
            displaySection.innerHTML += `<div class='pokemon-display empty'></div>`;
        }

        // Grow buttons
        ui.growDisplayCards();

        // Add click events
        for(let i = pageToNumPokemon[pageNum].min; i < pageToNumPokemon[pageNum].max; i++) {
            const currentMonCard = document.querySelector(`#dex-${i}`);
            currentMonCard.onclick = (e) => {
                // Loop through the list of select-effect divs
                for(const display of document.querySelectorAll('.select-effect')) {
                    // If any are selected, un-select them
                    if(display.classList.contains('selected')) {
                    display.classList.remove('selected');
                    }
                }

                interactor.getPokemonInfo(currentMonCard.id.substring(4));

                // Select the card
                currentMonCard.querySelector('.select-effect').classList.add('selected');
            };
        }
    }
};

export {init}