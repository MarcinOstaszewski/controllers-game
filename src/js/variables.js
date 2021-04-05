const alertInfo = document.getElementById("alert-info");
const gameContainer = document.getElementById('container');
const scrW = window.innerWidth;
const scrH = window.innerHeight;

const deg2rad = Math.PI / 180;
      
const minAx = 0.02;

const startPositions = {
    0: [scrW / 3, scrH / 3],
    1: [scrW / 3 * 2, scrH / 3 * 2],
    2: [scrW / 3, scrH / 3 * 2],
    3: [scrW / 3 * 2, scrH / 3],
}

const colors = {
    0: "#3c66f1",
    1: "#f1df3c",
    2: "#18c121",
    3: "#f13c4b",
}

const tanks = {};

export { alertInfo, gameContainer, deg2rad, minAx, scrW, scrH, startPositions, colors, tanks };