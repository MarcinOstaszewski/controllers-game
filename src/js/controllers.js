document.addEventListener('DOMContentLoaded', function () {

    let gamepadInfo = document.getElementById("gamepad-info");
    let buttonsInfo = document.getElementById("buttons-info");
    let dirInfo = document.getElementById("dir-info");
    let direction = document.getElementsByClassName("direction");
    let cars = document.getElementById("ship");
    let start;
    let minAx = 0.0002
    let dir;
    let pi = Math.PI;
    let gpInfo = {};

    function displayAllTextsFromObject (obj, elem) {
        elem.innerHTML = "";
        for (let ind in obj) {
            elem.innerHTML += obj[ind];
        }
    }

    window.addEventListener("gamepadconnected", function (e) {
        let gp = e.gamepad;
        gpInfo[gp.index] = "Gamepad connected at index " + gp.index + ". Buttons: " + gp.buttons.length + ". Axes " + gp.axes.length + "<br>";
        displayAllTextsFromObject(gpInfo, gamepadInfo)
        console.log(gp)
        gameLoop();
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        let gp = e.gamepad;
        console.log(gp)
        if (gpInfo[gp.index]) {
            delete gpInfo[gp.index];
            displayAllTextsFromObject(gpInfo, gamepadInfo)
        } else {
            gamepadInfo.innerHTML = "Waiting for gamepad.";
        }
    });

    function gameLoop() {
        var gamepads = navigator.getGamepads();
        if (!gamepads) return;

        var gp = {};
        var gpStatusText = "";
        for (let i = 0; i < 4; i++) {
            gpStatusText += "<br/><br/>GP" + i + ": buttons pressed: ";
            gp[i] = gamepads[i];
            if (gp[i]) {
                for (let j = 0; j < gp[i].buttons.length; j++) {
                    if (gp[i].buttons[j].pressed) {
                        gpStatusText += j + ", ";
                    }
                }
                let x0 = gp[i].axes[0];
                let y0 = gp[i].axes[1];
                let x1 = gp[i].axes[2];
                let y1 = gp[i].axes[3];
                let force = 0;
                gpStatusText += "<br/> axes: x0: " + x0.toFixed(5) + ", y0: " + y0.toFixed(5) + ", " + x1.toFixed(5) + ", " + y1.toFixed(5) + "<br/>";

                if (Math.abs(x0) > minAx || Math.abs(y0) > minAx) {
                    force = ( Math.abs(y0) + Math.abs(x0) ) - Math.abs(x0 * y0);
                }

                dirInfo.innerText = (x0 / y0);
                if (Math.abs(force) > minAx * 2) {

                    if (x0 > minAx && y0 < minAx || x0 < minAx && y0 < minAx) {
                        if (x0 / y0 !== -1) {
                            dir = -( Math.atan(x0 / y0) / pi * 180 );
                        }
                    } else if (x0 < minAx && y0 > minAx || x0 > minAx && y0 > minAx) {
                        dir = 180 - ( Math.atan(x0 / y0) / pi * 180 );
                    } 
                }
                gpStatusText += "Force: " + force + "<br/>angle: " + dir;
                if (dir) {
                    direction[i].style.transform = "rotate(" + dir + "deg)";
                }
            }
        }
        buttonsInfo.innerHTML = gpStatusText;

        start = window.requestAnimationFrame(gameLoop);
    };

})