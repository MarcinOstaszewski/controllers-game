document.addEventListener('DOMContentLoaded', function () {

    let dirInfo = document.getElementById("dir-info");
    let cars = {};
    const speed = 2;
    let scrW = window.innerWidth;
    let scrH = window.innerHeight;
    let positions = {
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

    createCar = (id) => {
        cars[id] = document.createElement('div');
        cars[id].setAttribute('id', id);
        cars[id].classList.add('car');
        console.log(id)
        cars[id].style.left = positions[id][0];
        cars[id].style.top = positions[id][1];
        cars[id].style.backgroundColor = colors[id];
        document.getElementById('container').appendChild(cars[id])
    }

    window.addEventListener("gamepadconnected", function (e) {
        let gp = e.gamepad;
        createCar(gp.index);
        gameLoop();
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        let gp = e.gamepad;
        console.log(gp)
    });

    function gameLoop() {
        var gamepads = navigator.getGamepads();
        if (!gamepads) return;

        var gp = {};
        for (let i = 0; i < 4; i++) {
            gp[i] = gamepads[i];
            if (gp[i]) {
                let dir = -500;
                let x0 = gp[i].axes[0];
                let y0 = gp[i].axes[1];
                let force = 0;

                if (Math.abs(x0) > minAx || Math.abs(y0) > minAx) {
                    force = ( Math.abs(y0) + Math.abs(x0) ) - Math.abs(x0 * y0);
                    
                    if (Math.abs(force) > minAx * 2) {
                        if (x0 > minAx && y0 < minAx || x0 < minAx && y0 < minAx) {
                            dir = -( Math.atan(x0 / y0) / pi * 180 );
                        } else if (x0 < minAx && y0 > minAx || x0 > minAx && y0 > minAx) {
                            dir = 180 - ( Math.atan(x0 / y0) / pi * 180 );
                        } 
                        if (dir > -500) {
                            cars[i].style.transform = "rotate(" + parseInt(dir) + "deg)";
                            dirInfo.innerHTML = parseFloat(cars[i].style.left) + " ___TOP: " + parseFloat(cars[i].style.top);
                            dirRad = dir * (pi / 180);
                            cars[i].style.left = (parseFloat(cars[i].style.left) + (Math.sin(dirRad) * force) * speed) + "px"; 
                            cars[i].style.top = (parseFloat(cars[i].style.top) - (Math.cos(dirRad) * force) * speed) + "px"; 
                        }
                    }
                    
                }

            }
        }

        start = window.requestAnimationFrame(gameLoop);
    };

})