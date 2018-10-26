let difficulty = 20;

let cellNature = {
    isBlank: 0,
    isNumber: 1,
    isMined: 2
};

let cellStatus = {
    isFlagged: 0,
    isQuestioned: 1,
    isUnchanged: 2,
    isRevealed: 3,
};

// Cell constructor

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.nature = cellNature.isBlank;
    this.neighborCount = 0;
    // todo generate a better algorithm
    if (random(100) < difficulty) {
        this.nature = cellNature.isMined;
        this.neighborCount = null;
    }

    this.status = cellStatus.isUnchanged;
    console.log('Cell Created');

    this.showStatus = function () {
        switch (this.status) {
            case cellStatus.isUnchanged:
                console.log('Cell Status: Unchanged');
                break;

            case cellStatus.isFlagged:
                console.log('Cell Status: isFlagged');
                break;
            case cellStatus.isQuestioned:
                console.log('Cell Status: Questioned');
                break;
            case cellStatus.isRevealed:
                console.log('Cell Status: Revealed');
                break;
        }
    };

}