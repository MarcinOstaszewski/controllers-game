import { gameContainer, tanks } from './variables.js';
import { gameLoop } from './gameLoop.js';
import { createTank } from './functions.js'

const gamepadsEvents = () => {

    window.addEventListener("gamepadconnected", function (e) {
        createTank(e.gamepad.index);
        gameLoop();
    });
    
    window.addEventListener("gamepaddisconnected", function (e) {
        let gp = e.gamepad;
        gameContainer.removeChild(tanks[gp.index].elem);
        delete tanks[gp.index].elem;
    });
}

export { gamepadsEvents };