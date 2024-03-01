import * as ui from './uiEffects.js'
import * as pokemonInteractor from './pokemonInteractor.js'
import * as serverInteraction from './serverInteraction.js'

let currentTeam = {
    'name': 'Team 1',
    'pokemon': {}
};

let allTeams = {

}

let currentPartyPlace = -1;

const init = () => {
    const addTeam = (e) => {
        e.preventDefault();
        saveTeam();
        return false;
    }

    const getTeam = (e) => {
        e.preventDefault();
        loadTeam();
        return false;
    }

    const inputTeamName = (e) => {
        changeTeamName(e.target.value);
        return true;
    }

    document.querySelector('#name-input').addEventListener('input', inputTeamName);
    document.querySelector('#save-btn').addEventListener('click', addTeam);
    document.querySelector('#load-btn').addEventListener('click', getTeam);
    document.querySelector('#clear-btn').addEventListener('click', clearTeam);
};

const assignTeamClick = () => {
    // Assign ripple effects
    const partySpots = document.querySelectorAll('.party-spot');
    for(const spot of partySpots) {
        spot.onclick = (e) => {
            // Remove all ripples
            ui.removeRipples();

            // Get the current x and y of the mouse click
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;

            // Create a span element that animations
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            spot.appendChild(ripples);

            // Find the index of the current spot
            for(let i = 0; i < partySpots.length; i++) {
                if(spot === partySpots[i]) {
                    // Set the current party place
                    currentPartyPlace = i;
                }
            }

            // If there's a pokemon at that party place, show it
            if(currentTeam.pokemon[currentPartyPlace] !== undefined) {
                pokemonInteractor.getPokemonInfo(currentTeam.pokemon[currentPartyPlace].id, true);
            } else {
                // Otherwise, clear the info to avoid confusion
                pokemonInteractor.clearPokemonInfo();
            }
        };
    }
};

const addToTeam = (pokemonName, pokemonID, pokemonIMG, pokemonPlace = null) => {
    // Check if there are six pokemon in the party already
    if(getTeamLength() >= 6) {
        return;
    }

    // Check if a party place was given
    if(pokemonPlace === null) {
        let nextPartyPlace = 0;

        // Check if there's a pokemon in that slot
        while(currentTeam.pokemon[nextPartyPlace] !== undefined) {
            // Increment the party place
            nextPartyPlace++;
        }

        // Set the party place to the found open slot
        pokemonPlace = nextPartyPlace;
    }

    // Add the new pokemon to the party
    currentTeam.pokemon[pokemonPlace] = {
        id: pokemonID,
        name: pokemonName,
        img: pokemonIMG
    };

    // Update the image
    const spotImage = document.querySelector(`#spot-${pokemonPlace + 1}`);
    spotImage.src = `${pokemonIMG}`;
    spotImage.style.opacity = 1;
}

const removeFromTeam = () => {
    // Remove the pokemon at the given place
    if(currentTeam.pokemon[currentPartyPlace] !== undefined) {
        delete currentTeam.pokemon[currentPartyPlace];

        const spotImage = document.querySelector(`#spot-${currentPartyPlace + 1}`)
        spotImage.style.opacity = 0;
        spotImage.src = '';
    }
}

const getTeamLength = () => {
    console.log("Current Team: " + JSON.stringify(currentTeam));
    console.log("Current Team Pokemon: " + currentTeam.pokemon);
    const pokemonKeys = Object.keys(currentTeam.pokemon);

    return pokemonKeys.length;
}

const changeTeamName = (newName) => {
    // Get the name input
    currentTeam.name = newName;
}

const saveTeam = async () => {
    // Remove ripples
    ui.removeRipples();

    // Build data
    let currentTeamName = currentTeam.name;
    const allTeamsKey = currentTeamName.replace(/\s/g, '');
    const data = JSON.stringify(currentTeam);
    

    let response = await fetch('/saveTeam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: data
    });

    // Wait for the server to handle the response
    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {   
        allTeams[allTeamsKey] = currentTeam;
        console.log("All Teams: " + JSON.stringify(allTeams));

        // Get the teams select
        const teamLoader = document.querySelector('#saved-teams');

        // Update load teams select
        let loadHTML = '';
        let allTeamsKeys = Object.keys(allTeams);
        for(let i = 0; i < allTeamsKeys.length; i++) {
            // Get the team name and sanitized name
            let saveName = allTeams[allTeamsKeys[i]].name;
            let sanitizedName = saveName.replace(/\s/g, '');
            console.log(`Save Name: ${saveName}, Sanitized Name: ${sanitizedName}`);

            loadHTML += 
            `<option value="${sanitizedName}">${saveName}</option>
            `
        }
        teamLoader.innerHTML = loadHTML;
    }
}

const loadTeam = async () => {
    // Remove ripples
    ui.removeRipples();

    // Get the current team name
    const teamSelect = document.querySelector('#saved-teams');
    let teamValue = teamSelect.value;
    let sanitizedValue = teamValue.replace(/\s/g, '');
    console.log(sanitizedValue);

    let response = await fetch(`/getTeam?name=${sanitizedValue}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Wait for the server to handle the response
    const obj = await serverInteraction.handleResponse(response, true);
    if(obj != null)
    {
        // Set the current team
        currentTeam = obj['Team 1'];

        // Update the team
        updateCurrentTeam();
    }
}

const clearTeam = () => {
    // Remove ripples
    ui.removeRipples();

    // Clear the pokemon in the current team
    currentTeam.pokemon = {};

    // Clear pokemon info
    pokemonInteractor.clearPokemonInfo();

    // Update the team
    updateCurrentTeam();
}

const updateCurrentTeam = async () => {
    // Loop through all of the slots
    for(let i = 0; i < 5; i++) {
        // Get the current spot
        const spotImage = document.querySelector(`#spot-${i + 1}`);

        // Check if there's a pokemon stored in data
        if(currentTeam.pokemon[i] !== undefined) {
            // If so, put a pokemon in that spot
            spotImage.src = `${currentTeam.pokemon[i].img}`;
            spotImage.style.opacity = 1;
        } else {
            // Otherwise, clear it
            spotImage.style.opacity = 0;
        }
    }
}

export {init, assignTeamClick, addToTeam, removeFromTeam, getTeamLength}