let dirInfo = document.getElementById("dir-info");
let alertInfo = document.getElementById("alert-info");
let gameContainer = document.getElementById('container');
let cars = {}
const speed = 1;
const maxTurn = 2;
let scrW = window.innerWidth;
let scrH = window.innerHeight;
let startPositions = {
    0: [scrW / 3, scrH / 3],
    1: [scrW / 3 * 2, scrH / 3 * 2],
    2: [scrW / 3, scrH / 3 * 2],
    3: [scrW / 3 * 2, scrH / 3],
}
let colors = {
    0: "#3c66f1",
    1: "#f1df3c",
    2: "#3c66f1",
    3: "#f13c4b",
}
let start;
let minAx = 0.0002
let pi = Math.PI;

document.addEventListener('DOMContentLoaded', function () {

    createCar = (id) => {
        cars[id] = {};
        cars[id].elem = document.createElement('div');
        cars[id].elem.setAttribute('id', id);
        cars[id].elem.classList.add('car');
        cars[id].elem.style.left = startPositions[id][0];
        cars[id].elem.style.top = startPositions[id][1];
        cars[id].elem.style.backgroundColor = colors[id];
        gameContainer.appendChild(cars[id].elem);
    }

    window.addEventListener("gamepadconnected", function (e) {
        createCar(e.gamepad.index);
        gameLoop();
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        let gp = e.gamepad;
        gameContainer.removeChild(cars[gp.index].elem);
        delete cars[gp.index].elem;
    });

    function gameLoop() {
        var gamepads = navigator.getGamepads();
        if (!gamepads) return;

        var gp = {};
        for (let i = 0; i < 4; i++) {
            gp[i] = gamepads[i];
            if (gp[i]) {
                let degDirection = -500;
                let x0 = gp[i].axes[0];
                let y0 = gp[i].axes[1];
                let force = 0;

                if (Math.abs(x0) > minAx || Math.abs(y0) > minAx) {
                    force = ( Math.abs(y0) + Math.abs(x0) ) - Math.abs(x0 * y0);
                    
                    if (Math.abs(force) > minAx * 2) {
                        if (x0 > minAx && y0 < minAx || x0 < minAx && y0 < minAx) {
                            degDirection =  - ( Math.atan(x0 / y0) / pi * 180 );
                        } else if (x0 < minAx && y0 > minAx || x0 > minAx && y0 > minAx) {
                            degDirection = 180 - ( Math.atan(x0 / y0) / pi * 180 );
                        } 
                        if (degDirection > -500) {
                            cars[i].dir = cars[i].elem.style.transform.slice(7, -4);
                            dirInfo.innerText = parseInt(cars[i].dir) + "____" + degDirection;
                            if ((cars[i].dir - degDirection) > maxTurn) {
                                alertInfo.innerHTML = "!!!!!!!";// cars[i].dir + "____" + parseInt(degDirection);
                                if (cars[i].dir > 0 && degDirection > 0) {
                                    console.log( cars[i].dir - degDirection + " _ " + cars[i].dir + " _ " + degDirection )
                                    if ( cars[i].dir > degDirection ) {
                                        degDirection = cars[i].dir + maxTurn;
                                    } else {
                                        degDirection = cars[i].dir - maxTurn;
                                    }
                                } else {
                                    console.log("-----" + cars[i].dir + " _ " + degDirection )
                                }
                            } else {
                                alertInfo.innerHTML = "";
                            }
                            cars[i].elem.style.transform = "rotate(" + parseInt(degDirection) + "deg)";
                            directionInRad = degDirection * (pi / 180);
                            cars[i].elem.style.left = (parseFloat(cars[i].elem.style.left) + (Math.sin(directionInRad) * force) * speed) + "px"; 
                            cars[i].elem.style.top = (parseFloat(cars[i].elem.style.top) - (Math.cos(directionInRad) * force) * speed) + "px"; 
                        }
                    }
                }
            }
        }

        start = window.requestAnimationFrame(gameLoop);
    };

})