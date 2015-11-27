/*
 * Canvas Disco Floor
 *
 * Copyright (c) 2015 Cyril Mestrom
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://www.pocketmenu.nl
 *
 * Version:  0.1
 *
 */


function DiscoFloor(canvas, config) {

    // set options or defaults
    this.config = config ? config : {};
    this.speed = this.config.speed || 100;
    this.sizeX = this.config.sizeX || 7;
    this.sizeY = this.config.sizeY || 4;
    this.colors = this.config.colors || ['#BCC22C', '#FD4E70', '#856A5E', '#6AB5AA', '#D5D97C'];
    this.borderColor = this.config.borderColor || '#000000';
    this.borderWidth = this.config.borderWith || 3;
    this.floorColor = this.config.floorColor || '#333333';

    // setup canvas
    this.canvas = document.getElementById(canvas);

    if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d');
    } else {
        console.log('can\'t create canvas');
        return false;
    }

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // create predefined patterns
    this.patterns = [];
    this.definePatterns();

    // draw startfloor
    this.patterns["all"].draw(this.floorColor);
    this.lastColor = this.config.floorColor;
}


DiscoFloor.prototype.addPattern = function (pattern) {
    // add pattern to defined patterns
    this.patterns[pattern.name] = pattern;
}


DiscoFloor.prototype.definePatterns = function () {

    // row by block
    var rowbyblock = new DiscoPattern(
        this,
        "row-by-block",
        this.sizeX * this.sizeY * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return (i * sizeX * speed) + (j * speed);
        })
    );

    this.addPattern(rowbyblock);

    // column by block
    var columnbyblock = new DiscoPattern(
        this,
        "column-by-block",
        this.sizeX * this.sizeY * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return (j * sizeY * speed) + (i * speed);
        })
    );

    this.addPattern(columnbyblock);

    // lines from top
    var linestop = new DiscoPattern(
        this,
        "lines-top",
        this.sizeY * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return (i * speed);
        })
    );

    this.addPattern(linestop);


    // lines from bottom
    var linesbottom = new DiscoPattern(
        this,
        "lines-bottom",
        this.sizeY * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return (sizeY - 1 - i) * speed
        })
    );

    this.addPattern(linesbottom);


    // diagonal from left top
    var diagonalLT = new DiscoPattern(
        this,
        "diagonalLT",
        (this.sizeX + this.sizeY - 1) * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return (i * speed) + (j * speed);
        })
    );

    this.addPattern(diagonalLT);


    // diagonal from left bottom
    var diagonalLB = new DiscoPattern(
        this,
        "diagonalLB",
        (this.sizeX + this.sizeY - 1) * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return ((sizeY - 1 - i) * speed) + (j * speed);
        })
    );

    this.addPattern(diagonalLB);

    // diagonal from right top
    var diagonalRT = new DiscoPattern(
        this,
        "diagonalRT",
        (this.sizeX + this.sizeY) * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return (i * speed) + ((sizeX - 1 - j) * speed);
        })
    );

    this.addPattern(diagonalRT);


    // diagonal from right bottom
    var diagonalRB = new DiscoPattern(
        this,
        "diagonalRB",
        (this.sizeX + this.sizeY) * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return ((sizeY - 1 - i) * speed) + ((sizeX - 1 - j) * speed);
        })
    );

    this.addPattern(diagonalRB);


    // all blocks at the same time
    var all = new DiscoPattern(
        this,
        "all",
        3 * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return 0;
        })
    );

    this.addPattern(all);

    // classic snake
    var snake = new DiscoPattern(
        this,
        "snake",
        this.sizeX * this.sizeY * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return i % 2 == 0 ? (i * sizeX * speed) + (j * speed) : (i * sizeX * speed) + ((sizeX - 1 - j) * speed);
        })
    );

    this.addPattern(snake);


    // classic snake
    var horizontalSplit = new DiscoPattern(
        this,
        "horizontalSplit",
        this.sizeX * this.sizeY * this.speed,
        (function (i, j, sizeX, sizeY, speed) {
            return i % 2 == 0 ? (i * sizeX * speed) + (j * speed) : (i * sizeX * speed) + ((sizeX - 1 - j) * speed);
        })
    );

    this.addPattern(snake);
}


DiscoFloor.prototype.startProgram = function (program, infinite) {
    var self = this;

    // change single string to array
    if (typeof program === 'string') {
        program = [program];
    }

    var totalDuration = 0;

    for (var i = 0; i < program.length; i++) {
        var p = this.patterns[program[i]];
        totalDuration += p.duration;
    }

    // always do one run
    self.drawProgram(program);

    // repeat if infinite is true, default is true
    if (infinite ? infinite : true) {
        setInterval(function () {
            self.drawProgram(program);
        }, totalDuration);
    }
}


DiscoFloor.prototype.drawProgram = function (program) {
    var programDuration = 0;

    // loop through program to play each pattern
    for (var i = 0; i < program.length; i++) {
        var p = this.patterns[program[i]];
        (function (p) {
            setTimeout(function () {
                console.log('drawing: ' + p.name);
                p.draw();
            }, programDuration);
        }(p));

        // add duration to determine timeout
        programDuration += p.duration;
    }
}


function DiscoPattern(floor, name, duration, pattern) {
    // reference to DiscoFloor
    this.floor = floor;
    // name of patterm
    this.name = name;
    // duration of drawing the whole pattern
    this.duration = duration;
    // timing function on how to draw the pattern
    this.pattern = pattern;
}

DiscoPattern.prototype.draw = function (color) {
    var self = this;

    // random color if color is not provided
    var random = Math.floor(Math.random() * (this.floor.colors.length - 1));
    var color = color ? color : this.floor.colors[random];

    // make sure a different color is used as the previous pattern
    if (color == self.floor.lastColor)
        color = this.floor.colors[Math.abs(random - 1)];

    // get size of blocks
    var bw = this.floor.width / this.floor.sizeX;
    var bh = this.floor.height / this.floor.sizeY;

    // paint cubes
    for (i = 0; i < this.floor.sizeY; i++) {
        for (j = 0; j < this.floor.sizeX; j++) {
            this.drawCube(bw * j, bh * i, bw, bh, i, j, color);
        }
    }

    // set variable for used color to prevent same color for next pattern
    self.floor.lastColor = color;
}

DiscoPattern.prototype.drawCube = function (x, y, width, height, i, j, color) {
    var self = this;
    // paint cube with settimeout used for pattern
    setTimeout(function () {
        self.floor.ctx.clearRect(x, y, width, height);
        self.floor.ctx.fillStyle = color;
        self.floor.ctx.fillRect(x, y, width, height);
        self.floor.ctx.fillStyle = self.floor.borderColor;
        self.floor.ctx.lineWidth = self.floor.borderWidth;
        self.floor.ctx.strokeRect(x, y, width, height);
    },
        (function (self, i, j) {
            return self.pattern(i, j, self.floor.sizeX, self.floor.sizeY, self.floor.speed);
        }(self, i, j))
    );
}
