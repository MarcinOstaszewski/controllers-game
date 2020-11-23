let dirInfo = document.getElementById("dir-info");
let alertInfo = document.getElementById("alert-info");
let gameContainer = document.getElementById('container');
let cars = {};
let carsDirections = {};
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
        cars[id] = document.createElement('div');
        cars[id].setAttribute('id', id);
        cars[id].classList.add('car');
        cars[id].style.left = startPositions[id][0];
        cars[id].style.top = startPositions[id][1];
        cars[id].style.backgroundColor = colors[id];
        gameContainer.appendChild(cars[id]);
    }

    window.addEventListener("gamepadconnected", function (e) {
        createCar(e.gamepad.index);
        gameLoop();
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        let gp = e.gamepad;
        gameContainer.removeChild(cars[gp.index]);
        delete cars[gp.index];
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
                            carsDirections[i] = cars[i].style.transform.slice(7, -4);
                            dirInfo.innerText = parseInt(carsDirections[i]) + "____" + degDirection;
                            if ((carsDirections[i] - degDirection) > maxTurn) {
                                alertInfo.innerHTML = "!!!!!!!";// carsDirections[i] + "____" + parseInt(degDirection);
                                if (carsDirections[i] > 0 && degDirection > 0) {
                                    console.log( carsDirections[i] - degDirection + " _ " + carsDirections[i] + " _ " + degDirection )
                                    if ( carsDirections[i] > degDirection ) {
                                        degDirection = carsDirections[i] + maxTurn;
                                    } else {
                                        degDirection = carsDirections[i] - maxTurn;
                                    }
                                } else {
                                    console.log("-----" + carsDirections[i] + " _ " + degDirection )
                                }

                            } else {
                                alertInfo.innerHTML = "";
                            }
                            cars[i].style.transform = "rotate(" + parseInt(degDirection) + "deg)";

                            // cars[i].style.transform = "rotate(" + parseInt(degDirection) + "deg)";
                            //" currDir: " + cars[i].style.transform.slice(7, -4) + " newDir: " + parseInt(degDirection);
                            directionInRad = degDirection * (pi / 180);
                            cars[i].style.left = (parseFloat(cars[i].style.left) + (Math.sin(directionInRad) * force) * speed) + "px"; 
                            cars[i].style.top = (parseFloat(cars[i].style.top) - (Math.cos(directionInRad) * force) * speed) + "px"; 
                        }
                    }
                    
                }

            }
        }

        start = window.requestAnimationFrame(gameLoop);
    };

})