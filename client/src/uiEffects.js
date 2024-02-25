const assignSpotHover = () => {
    // Assign hover effects
    const partySpots = document.querySelectorAll('.party-spot');
    const partyHolder = document.querySelector('#party');
    partyHolder.onmousemove = (e) => {
      // Iterate through the party spots
      for(const spot of partySpots) {
        // Set CSS variables
        const rect = spot.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top;

        spot.style.setProperty('--mouse-x', `${x}px`);
        spot.style.setProperty('--mouse-y', `${y}px`);
      }
    }
};

const growDisplayCards = () => {
  // Get the list of display cards
  const displayCards = document.querySelectorAll('.pokemon-display');
  
  // Set a counter
  let index = 0;

  // Set an interval
  const intervalId = setInterval(() => {
    if(index >= displayCards.length) {
      // If beyond the length of the display card list,
      // clear the interval
      clearInterval(intervalId);
      return;
    }

    // Get the current card
    const card = displayCards[index];

    // Add the 'grown' class
    card.classList.add('grown');

    // Increment the index
    index++;
  }, 20);
};
const removeRipples = () => {
  // Remove the other ripples
  for(const otherSpots of document.querySelectorAll('.party-spot')) {
    // Iterate through the spot
    const rippleSpan = otherSpots.querySelector('span');

    // If a ripple exists, remove it
    if(rippleSpan !== null) {
        rippleSpan.remove();
    }
  }
}

const init = () => {
    assignSpotHover();
};

export {init, growDisplayCards, removeRipples}