const assignSpotHover = () => {
    // Assign hover effects
    const partySpots = document.querySelectorAll('.party-spot');
    const partyHolder = document.querySelector('#party');
    partyHolder.onmousemove = (e) => {
      for(const spot of partySpots) {
        const rect = spot.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top;

        spot.style.setProperty('--mouse-x', `${x}px`);
        spot.style.setProperty('--mouse-y', `${y}px`);
      }
    }
};

const assignRippleClick = () => {
    // Assign ripple effects
    const partySpots = document.querySelectorAll('.party-spot');
    for(const spot of partySpots) {
        spot.onclick = (e) => {
          const x = e.clientX - e.target.offsetLeft;
          const y = e.clientY - e.target.offsetTop;

          let ripples = document.createElement('span');
          ripples.style.left = x + 'px';
          ripples.style.top = y + 'px';
          spot.appendChild(ripples);

          setTimeout(() => {
            ripples.remove()
          }, 1000);
        }
      }
};

const init = () => {
    assignSpotHover();
    assignRippleClick();
};

export {init}