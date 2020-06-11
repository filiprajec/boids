var fps = require("fps"),
  ticker = require("ticker"),
  debounce = require("debounce"),
  Boids = require("."),
  pixelBox = require("./pixelbox");

const box = new pixelBox(window.innerWidth, window.innerHeight, 40);

var attractors = [
  [
    Infinity, // x
    Infinity, // y
    100, // dist
    0.25, // spd
  ],
];

// set maximum number of boids in animation
var maxBoids = 300;
// do we want to draw our boids?
let drawBoids = true;

var canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  boids = Boids({
    boids: maxBoids,
    speedLimit: 3,
    accelerationLimit: 0.5,
    separationDistance: 90, // Radius at which boids avoid others
    alignmentDistance: 220, // Radius at which boids align with others
    choesionDistance: 220, // Radius at which boids approach others
    separationForce: 0.15, // Speed to avoid at
    alignmentForce: 0.45, // Speed to align with other boids
    choesionForce: 0.2, // Speed to move towards other boids
    // attractors: attractors,
  });

  // may imporve 'bluriness'
  ctx.translate(0.5, 0.5);

document.body.onmousemove = function (e) {
  var halfHeight = canvas.height / 2,
    halfWidth = canvas.width / 2;

  attractors[0][0] = e.x - halfWidth;
  attractors[0][1] = e.y - halfHeight;
};

window.onresize = debounce(function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, 100);
window.onresize();

document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.appendChild(canvas);

ticker(window, 60)
  .on("tick", function () {
    frames.tick();
    boids.tick();
    box.clearBoidCount();
  })
  .on("draw", function () {
    var boidData = boids.boids,
      halfHeight = canvas.height / 2,
      halfWidth = canvas.width / 2;

    // set background colour
    ctx.fillStyle = "#7BDDD8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // set boid colour
    ctx.fillStyle = "rgba(68, 207, 197, 1.00)";

    for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
      x = boidData[i][0];
      y = boidData[i][1];
      // wrap around the screen
      boidData[i][0] =
        x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x;
      boidData[i][1] =
        y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y;

      if (drawBoids) {
        ctx.beginPath();
        ctx.arc(
          x + halfWidth,
          y + halfHeight,
          2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      // add boid position to pixel box boid counter array
      box.addToBoidCount(x + halfWidth, y + halfHeight);
    }

    // draw the pixel box
    box.drawPixels(ctx, "circle");
  });

var frameText = document.querySelector("[data-fps]");
var countText = document.querySelector("[data-count]");

var frames = fps({ every: 10, decay: 0.04 }).on("data", function (rate) {
  for (var i = 0; i < 3; i += 1) {
    if (rate <= 56 && boids.boids.length > 10) boids.boids.pop();
    if (rate >= 60 && boids.boids.length < maxBoids)
      boids.boids.push([
        0,
        0,
        Math.random() * 6 - 3,
        Math.random() * 6 - 3,
        0,
        0,
      ]);
  }
  frameText.innerHTML = String(Math.round(rate));
  countText.innerHTML = String(boids.boids.length);
});
