/* Developed By	: Noman the Alien*/
/* Created On	: 2018-10-26; 03:38:45 */


// ============================= global variables ================================

// ----------------- dimensions -------------------
const w = 40;
const rows = 6;
const columns = 8;
const offset = 2;

// ----------------- colors ------------------
var green1 = "";
var green2 = "";
var mate1 = "";
var mate2 = "";

// current focus

var current = {
    x: 0,
    y: 0
};


// cells arrays
var cells = new Array(rows);

// first show
let firstTime = null;

// mines array
let mines = [];

// total flag count
let flagCount = 0;

function setup() {
    // create canvas as the screen size
    // noinspection JSUnresolvedFunction
    createCanvas(rows * w + offset * 2, columns * w + offset * 2);

    // setting up colors
    green1 = color('rgb(167, 217, 72)');
    green2 = color('rgb(142, 204, 57)');
    mate1 = color('rgb(229, 194, 159)');
    mate2 = color('rgb(215, 184, 153)');

    // cells array
    for (let i = 0; i < rows; i++) {
        cells[i] = new Array(columns);
    }

    // setting up the cells array
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            cells[i][j] = new Cell(i, j);
        }
    }

    // creating a array of mines

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (cells[i][j].nature == cellNature.isMined) {
                mines.push(cells[i][j]);
            }
        }
    }

    console.log('Mine Count: ' + mines.length.toString());


    // counting mined neighbors
    countMinedNeighbors();

    // filter out the numbers
    filterNumberTiles();

    // offset graphics issue
    background('pink');

    // var counts = new Array(rows);
    // for (let i = 0; i < rows; i++) {
    //     counts[i] = new Array(columns);
    // }

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < rows; j++) {
    //         counts[i][j] = cells[i][j].neighborCount;
    //     }
    // }

    // console.table(counts);

    // first Reveal
    firstTime = true;
}

function keyPressed() {
    switch (keyCode) {
        // case UP_ARROW:
        //     console.log('Up Arrow Pressed');
        //     break;

        // case DOWN_ARROW:
        //     console.log('Down Arrow Pressed');
        //     break;

        // case LEFT_ARROW:
        //     console.log('Left Arrow Pressed');
        //     break;

        // case RIGHT_ARROW:
        //     console.log('Right Arrow Pressed');
        //     break;
        case ENTER:
            window.location.href = "/game.html";
            break;
    }
}

function keyTyped() {
    switch (key) {

        // navigation buttons

        case '2':
            current.y--;
            // console.log('Up Arrow Pressed');
            break;

        case '8':
            current.y++;
            // console.log('Down Arrow Pressed');
            break;

        case '4':
            current.x--;
            // console.log('Left Arrow Pressed');
            break;

        case '6':
            current.x++;
            // console.log('Right Arrow Pressed');
            break;

            // action buttons

        case '1':
            current.x--;
            current.y--;
            // console.log('Cross Up Left');
            break;

        case '3':
            current.x++;
            current.y--;
            // console.log('Cross Up Right');
            break;

        case '7':
            current.x--;
            current.y++;
            // console.log('Cross Down Right');
            break;

        case '9':
            current.x++;
            current.y++;
            // console.log('Cross Down Left');
            break;
        case '0':
            switch (cells[current.x][current.y].status) {
                case cellStatus.isUnchanged:
                    if (flagCount <= mines.length) {
                        cells[current.x][current.y].status = cellStatus.isFlagged;
                        flagCount++;
                    }
                    break;

                case cellStatus.isFlagged:
                    cells[current.x][current.y].status = cellStatus.isQuestioned;
                    flagCount--;
                    break;

                case cellStatus.isQuestioned:
                    cells[current.x][current.y].status = cellStatus.isUnchanged;
                    break;

                case cellStatus.isRevealed:
                    // console.log('Cell is already revealed.\nNo Action taken');
                    break;
            }
            checkForWin();
            break;

        case '5':
            firstTimeRun();
            checkForHit();
            clearNearbyBlanks();
            cells[current.x][current.y].status = cellStatus.isRevealed;
            // console.log(`Reveal Block ${current.x}, ${current.y}`);
            break;

    }

    // if x is off the limit
    if (current.x < 0) {
        current.x = rows - 1;
    } else if (current.x > rows - 1) {
        current.x = 0;
    }

    // if y is off the limit
    if (current.y < 0) {
        current.y = columns - 1;
    } else if (current.y > columns - 1) {
        current.y = 0;
    }

    // console.log(`x: ${current.x} y: ${current.y}`);
    // cells[current.x][current.y].showStatus();

}

function draw() {
    drawPlayingField();
    focusCurrent();
}

/** 
 * highlights the current focus box
 */
function focusCurrent() {
    noFill();
    stroke('red');
    strokeWeight(offset);
    rect(current.x * w + offset, current.y * w + offset, w, w);
}

/**
 * Draws the whole mining field
 */
function drawPlayingField() {
    // setting up the playing field
    noStroke();
    // draw the grids first
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let corner = {
                x: i * w + offset + 10,
                y: j * w + offset + 5
            };
            if (cells[i][j].status == cellStatus.isRevealed) {
                if ((i + j) % 2) {
                    fill(mate2);
                } else {
                    fill(mate1);
                }
                rect(i * w + offset, j * w + offset, w, w);

                switch (cells[i][j].nature) {
                    case cellNature.isMined:
                        let currentColor = getRandomColor(i + j);

                        // rectangular background color
                        fill(currentColor);
                        rect(i * w + offset, j * w + offset, w, w);

                        // mine color
                        currentColor.setAlpha(200);
                        fill(currentColor);
                        ellipse(i * w + w * 0.5 + offset, j * w + w * 0.5 + offset, w * 0.5, w * 0.5);
                        noStroke();
                        noFill();
                        break;

                    case cellNature.isNumber:
                        // show the count
                        textSize(32);
                        fill(getRandomColor(i + j));
                        text(cells[i][j].neighborCount.toString(), corner.x, corner.y + 25);
                        break;
                }

            } else {
                if ((i + j) % 2) {
                    fill(green2);
                } else {
                    fill(green1);
                }

                // green background for not revealed
                rect(i * w + offset, j * w + offset, w, w);

                switch (cells[i][j].status) {
                    case cellStatus.isFlagged:
                        // margin is 10px  from all sides
                        // top corner is x + 10, y + 10
                        fill('red');
                        rect(corner.x, corner.y, 3, 30);
                        triangle(corner.x, corner.y, corner.x, corner.y + 20, corner.x + 20, corner.y + 10);
                        break;
                    case cellStatus.isQuestioned:
                        textSize(32);
                        fill(0, 102, 153);
                        text('?', corner.x, corner.y + 25);
                        break;
                }
            }
        }
    }
}

function countMinedNeighbors() {
    let x, y;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (cells[i][j].neighborCount !== null) {
                for (let xOff = -1; xOff <= 1; xOff++) {
                    for (let yOff = -1; yOff <= 1; yOff++) {
                        x = i + xOff;
                        y = j + yOff;
                        if (x > -1 && y > -1 && x < rows && y < columns) {
                            // console.log(`Checking Neighbor: ${x}, ${y}`);
                            cells[i][j].neighborCount += (cells[x][y].nature == cellNature.isMined) ? 1 : 0;
                        }
                    }
                }
            }
            // console.log(`Count on Cell: ${i}, ${j}: ${cells[i][j].neighborCount}`);
        }
    }

    // console.log('Mined Neighbors Counted');
}

function filterNumberTiles() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let neighbors = cells[i][j].neighborCount;
            if (!(neighbors === null || neighbors === 0)) {
                cells[i][j].nature = cellNature.isNumber;
            }
        }
    }
    // console.log('Number Tiles Filtered');
}

function firstTimeRun() {
    if (!firstTime) {
        return;
    }
    let i = current.x;
    let j = current.y;
    if (cells[i][j].nature !== cellNature.isMined) {
        for (let xOff = -2; xOff <= 2; xOff += 1) {
            for (let yOff = -2; yOff <= 2; yOff += 1) {
                x = i + xOff;
                y = j + yOff;
                // if within the range
                if (x > -1 && y > -1 && x < rows && y < columns) {
                    // mined cells will not be opened
                    if (cells[x][y].nature !== cellNature.isMined) {
                        cells[x][y].status = cellStatus.isRevealed;
                    }
                }
            }
        }
    }

    firstTime = false;
}

function checkForHit() {
    if (cells[current.x][current.y].nature == cellNature.isMined) {
        // reveal all the cells
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (cells[i][j].nature == cellNature.isMined) {
                    cells[i][j].status = cellStatus.isRevealed;
                }
            }
        }
    }
}

function checkForWin() {
    for (let i = 0; i < mines.length; i++) {
        if (mines[i].status != cellStatus.isFlagged) {
            return;
        }
    }
    textSize(28);
    noFill();
    text("You Win", windowWidth * 0.25 + offset * 2, windowHeight * 0.5);

}

function clearNearbyBlanks() {
    if (cells[current.x][current.y].nature == cellNature.isBlank && cells[current.x][current.y].status == cellStatus.isUnchanged) {
        for (let xOff = -1; xOff <= 1; xOff += 1) {
            for (let yOff = -1; yOff <= 1; yOff += 1) {
                x = current.x + xOff;
                y = current.y + yOff;
                // if within the range
                if (x > -1 && y > -1 && x < rows && y < columns) {
                    // mined cells will not be opened
                    if (cells[x][y].nature !== cellNature.isBlank) {
                        cells[x][y].status = cellStatus.isRevealed;
                    }
                }
            }
        }
    }
}

function getRandomColor(num) {
    let randColor = null;
    if (num % 3 == 0 && num % 5 == 0) {
        randColor = color(255, 0, 0); // red 
    } else if (num % 10 == 0) {
        randColor = color(255, 99, 0); // orange
    } else if (num % 9 == 0) {
        randColor = color(255, 255, 0); // yellow
    } else if (num % 3 == 0 || num % 6 == 0) {
        randColor = color(0, 0, 255); // blue
    } else if (num % 8 == 0) {
        randColor = color(189, 49, 255); // light violet
    } else if (num % 6 == 0) {
        randColor = color(255, 0, 255); // pink
    } else if (num % 2 == 0 || num % 4 == 0) {
        randColor = color(110, 171, 176); // whitish blue
    } else {
        randColor = color(128, 0, 0); // brown
    }

    randColor.setAlpha(120);

    return randColor;

}