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
    }

    const enterTeamName = (e) => {
        editTeamName(e.target.value);
    }

    document.querySelector('#name-input').addEventListener('input', inputTeamName);
    document.querySelector('#name-input').addEventListener('change', enterTeamName);
    document.querySelector('#name-input').addEventListener('focusout', enterTeamName);
    document.querySelector('#new-btn').addEventListener('click', newTeam);
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
    const pokemonKeys = Object.keys(currentTeam.pokemon);

    return pokemonKeys.length;
}

const changeTeamName = (newName) => {
    // Get the name input
    currentTeam.name = newName;
}

const editTeamName = (nameToEdit) => {
    let newName = checkDuplicateNames(nameToEdit, true);
    currentTeam.name = newName;

    // Reset input variables
    const nameInput = document.querySelector("#name-input");
    nameInput.value = newName;
}

const saveTeam = async () => {
    // Remove ripples
    ui.removeRipples();

    // Deep clone currentTeam
    const currentTeamClone = JSON.parse(JSON.stringify(currentTeam));

    // Build data
    const currentTeamName = currentTeamClone.name;
    currentTeamClone.name = currentTeamName.replace(/\s/g, '').replace(/\(/g, '%').replace(/\)/g, '%');
    const data = JSON.stringify(currentTeamClone);

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
        // Return if request was bad
        if(currentTeamClone.name === "" || Object.keys(currentTeamClone.pokemon).length < 1) return;

        // Add the team to the list of all teams
        allTeams[currentTeamName] = currentTeamClone;

        // Get the teams select
        const teamLoader = document.querySelector('#saved-teams');

        // Update load teams select
        let loadHTML = '';
        let allTeamsKeys = Object.keys(allTeams);
        for(let i = 0; i < allTeamsKeys.length; i++) {
            // Get the team name and sanitized name
            let saveName = allTeamsKeys[i];
            let sanitizedName = saveName.replace(/\s/g, '');

            loadHTML += 
            `<option value="${sanitizedName}" id="team-${i + 1}">${saveName}</option>
            `
        }
        teamLoader.innerHTML = loadHTML;

        // Update header
        document.querySelector("#team-header").innerHTML = `CURRENT TEAM (${currentTeamName.toUpperCase()})`;
    }
}

const loadTeam = async () => {
    // Remove ripples
    ui.removeRipples();

    // Get the current team name
    const teamSelect = document.querySelector('#saved-teams');
    let teamValue = teamSelect.value;
    let sanitizedValue = teamValue.replace(/\s/g, '').replace(/\(/g, '%').replace(/\)/g, '%');

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
        currentTeam = obj;

        // Update the team
        updateCurrentTeam();

        // Update header
        const selectedOption = teamSelect.selectedOptions[0];
        const teamName = selectedOption.innerHTML;
        document.querySelector("#team-header").innerHTML = `CURRENT TEAM (${teamName.toUpperCase()})` // PUT TEAM NAME HERE
    }
}

const newTeam = () => {
    // Clear the team
    clearTeam();

    // Check duplicate names
    let newName = checkDuplicateNames("New Team", false);

    // Reset input variables
    const nameInput = document.querySelector("#name-input");
    nameInput.value = newName;

    // Set team name
    currentTeam.name = newName;
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

const checkDuplicateNames = (nameToCheck, editing) => {
    // Check if editing (true) or making a new team (false)
    if(editing)
    {
        // Don't update when working with the current team
        if(nameToCheck === currentTeam.name) return nameToCheck;
    }

    // Get the current teams
    const teamSelect = document.querySelector("#saved-teams"); // HTML <select> element

    // Check for duplicates
    let newNameWithNumber = nameToCheck;
    const existingNames = Array.from(teamSelect.options).map(option => option.text);

    // Append a number to the end of the name depending on the number of duplicates
    let count = 1;
    while (existingNames.includes(newNameWithNumber)) {
        newNameWithNumber = `${nameToCheck} (${count})`;
        count++;
    }

    return newNameWithNumber;
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