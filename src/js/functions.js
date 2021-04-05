import { gameContainer, startPositions, colors, tanks } from './variables.js';

const createTank = id => {
    tanks[id] = {};
    tanks[id].elem = document.createElement('div');
    tanks[id].elem.setAttribute('id', id);
    tanks[id].elem.classList.add('tank');
    tanks[id].elem.style.left = startPositions[id][0];
    tanks[id].elem.style.top = startPositions[id][1];
    tanks[id].elem.style.backgroundColor = colors[id];
    tanks[id].values = {x: startPositions[id][0], y: startPositions[id][1], dir: 0, vX: 0, vY: 0, vR: 0};
    gameContainer.appendChild(tanks[id].elem);
}

const fix = (n, t = 3) => {
    return Number(n.toFixed(t));
}

export { createTank, fix };