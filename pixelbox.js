module.exports = pixelBox;

function pixelBox(pageWidth, pageHeight, pixelXCount) {
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
  
    // calculate pixel size and number of pixels in Y direction
    this.pixelXCount = pixelXCount;
    this.pixelSize = this.pageWidth / this.pixelXCount;
    this.pixelYCount = Math.ceil(this.pageHeight/this.pixelSize);
  
    // create an array to hold the boid count per pixel
    this.boidCount = createArray(this.pixelXCount, this.pixelYCount);
}

pixelBox.prototype.drawPixels = function (canvasContext, shape) {
    for (let i = 0; i < this.pixelXCount; i++) {
        for (let j = 0; j < this.pixelYCount; j++) {
            // create colour from boid number
            var boidNumber = this.boidCount[i][j];
            // check nearest X entries in array for boids
            // and add their boid numbers
            let nearestNumberCheck = 4;
            var count = 0;
            for (let k = -nearestNumberCheck; k <= nearestNumberCheck; k++) {
                for (let l = -nearestNumberCheck; l <= nearestNumberCheck; l++) {
                    // set certain conditions for which indicies to check
                    // avoids out of bounds errors
                    if (
                        i + k > 0 &&
                        j + l > 0 &&
                        i + k < this.pixelXCount &&
                        j + l < this.pixelYCount
                    ) {
                        // next check if within circle shaped check area
                        if(Math.abs(k) <= ( nearestNumberCheck + 1 - Math.abs(l))  ) {
                            // add to the total boid number if all conditions satisfied
                            boidNumber += this.boidCount[i + k][j + l];
                            count++;
                        }
                    }
                }
            }
            // divide by number of entries check to ensure we have a fair normalisation
            boidNumber = (boidNumber / count);

            // set fill colours of pixels
            let fillColor = "rgba(255,255,255," + boidNumber + ")";
            let fillColorLighter = "rgba(255,255,255," + boidNumber/3 + ")";

            // calculate size of pixels
            let size = (boidNumber * this.pixelSize);
            let sizeLarger = (boidNumber*2 * this.pixelSize);
            // limit sizes to max size of pixel
            if (size > this.pixelSize) size = this.pixelSize;
            if (sizeLarger > this.pixelSize) sizeLarger = this.pixelSize;

            // draw pixels depending on all the above settings
            if (shape === "circle") {
                // draw pixels as circles
                canvasContext.beginPath();
                canvasContext.arc(
                    i * this.pixelSize,
                    j * this.pixelSize,
                    size/2.5,
                    0,
                    2 * Math.PI
                );
                canvasContext.fillStyle = fillColor;
                canvasContext.fill();
            }
            else if (shape === "square") {
                // draw pixels as rectangles
                canvasContext.beginPath();
                canvasContext.rect(
                i * this.pixelSize - sizeLarger / 2,
                j * this.pixelSize - sizeLarger / 2,
                sizeLarger,
                sizeLarger
                );
                canvasContext.fillStyle = fillColorLighter;
                canvasContext.fill();
            }   
        }
    }
};

// fill boid counter array with zeros
pixelBox.prototype.clearBoidCount = function () {
    for (let i = 0; i < this.pixelXCount; i++) {
        for (let j = 0; j < this.pixelYCount; j++) {
            this.boidCount[i][j] = 0;
        }
    }
};

// add a boid to the boid counter array by X and Y co-ordinate
pixelBox.prototype.addToBoidCount = function (posX, posY) {
    // check that X & Y are valid
    if (isNaN(posX)) return;
    if (isNaN(posY)) return;
    // calculate pixel number that boid is in
    let xNumber = Math.floor(posX / this.pixelSize);
    let yNumber = Math.floor(posY / this.pixelSize);
    // sanity checks to remain within allowed indices
    if (xNumber < 0) xNumber = 0;
    if (yNumber < 0) yNumber = 0;
    if (xNumber > this.pixelXCount - 1) xNumber = this.pixelXCount - 1;
    if (yNumber > this.pixelYCount - 1) yNumber = this.pixelYCount - 1;
    // add a number to this box
    this.boidCount[xNumber][yNumber] += 1;
};

pixelBox.prototype.getBoidCountForPoint = function (x, y) {
    return this.boidCount[x][y];
};

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}