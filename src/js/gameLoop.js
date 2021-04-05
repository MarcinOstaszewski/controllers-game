import { alertInfo, deg2rad, minAx, tanks } from './variables.js';
import { fix } from './functions.js';

let timer;

function gameLoop() {
    var gamepads = navigator.getGamepads();
    if (!gamepads) return; // add info: 'connect controller(s) [or use QA ED keys]'

    var gp = {};
    for (let i = 0; i < 4; i++) {
        gp[i] = gamepads[i];
        if (gp[i]) {
            let lY = gp[i].axes[1];
            let rY = gp[i].axes[3];
            let vR = tanks[i].values.vR - fix(lY - rY);
            let vChg = lY + rY;
            let {x, y, dir} = tanks[i].values;
            alertInfo.innerText = 'lY: ' + fix(lY) +
                '\nrY: ' + fix(rY) + 
                '\nvR: ' + vR +
                '\nvChg: ' + vChg +
                '\nX: ' + fix(x, 1) + 
                '\nY: ' + fix(y, 1) +
                '\nYdir: ' + fix(dir, 0);

            tanks[i].values.dir += vR;
            tanks[i].values.y += vChg * Math.cos(dir * deg2rad) * 2;
            tanks[i].values.x -= vChg * Math.sin(dir * deg2rad) * 2;

            tanks[i].elem.style.transform = "rotate(" + parseInt(tanks[i].values.dir) + "deg)";
            tanks[i].elem.style.top = tanks[i].values.y;
            tanks[i].elem.style.left = tanks[i].values.x;
        }
    }

    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => gameLoop());
};

export { gameLoop };