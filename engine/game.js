/*
Add your code for Game here
 */
 //Collaboraters:
 //Emre Yanmis
 //Hamza Kidwai
 
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
};

const random2Or4 = () => {
    let x = Math.random();
    if (x > 0.1) return 2;
    return 4;
}

const addTile = (board) => {
    let x = 0;
    let y = 0;
    let tries = 0;

    // generate random indices
    do {
        x = randomInt(0, board.length);
        y = randomInt(0, board.length);
        tries++;
    } while (board[x][y] && tries < 100);

    // add random tile
    if (tries < 100) {
        board[x][y] = random2Or4();
        return true;
    }

    return false;
}

const combineTiles = (arr, inst) => {
    let n = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        let tile = arr[i];

        if (arr[i - 1] == tile) {
            // combine tiles and update score
            n.push(tile * 2);
            inst._score += (tile * 2);

            // check if won
            if ((tile * 2) == 2048)
                inst._won = true;

            i--;
        } else {
            n.push(tile);
        }
    }

    return n;
};

const isMovePossible = (tiles, size) => {
    let combineLeft = false;

    // check if two of same tiles are next to each other
    for (let i = 0; i < (tiles.length - 1); i++) {
        if (tiles[i] == tiles[i + 1])
            combineLeft = true;
    }

    // return whether still can combine or 0s left
    return combineLeft || (tiles.length < size);
};

const areMovesPossible = (board) => {
    let movesLeft = false;
    const transpose = board[0].map((col, i) => board.map(row => row[i]));

    // check if more tiles can be added
    for (let i = 0; i < board.length; i++) {
        // check by rows
        let tiles = board[i].filter(x => x);
        if (isMovePossible(tiles, board.length))
            movesLeft = true;
        
        // check by cols
        tiles = transpose[i].filter(x => x);
        if (isMovePossible(tiles, board.length))
            movesLeft = true;
    }

    return movesLeft;
}

const emit = (event, object) => {
    for (const callback of object['_' + event]) {
        if (callback)
            callback(object.gameState);
    }
}

export default class Game {

    constructor(size) {
        // set up a new game state
        this._size = size;
        this._onMove = [];
        this._onWin = [];
        this._onLose = [];
        this.setupNewGame();
    }

    setupNewGame() {
        this._board = Array(this._size).fill().map(() => Array(this._size).fill(0));
        this._score = 0;
        this._won = false;
        this._over = false;

        // get both random indices and random tile
        let x1 = randomInt(0, this._size);
        let y1 = randomInt(0, this._size);
        this._board[x1][y1] = random2Or4();

        // get random indices
        let x2 = randomInt(0, this._size);
        let y2 = randomInt(0, this._size);

        // ensure indices not same as other tiles
        while (x1 == x2 && y1 == y2) {
            x2 = randomInt(0, this._size);
            y2 = randomInt(0, this._size);
        }

        // get random tile
        this._board[x2][y2] = random2Or4();
    }

    loadGame(gameState) {
        this._score = gameState.score;
        this._won = gameState.won;
        this._over = gameState.over;

        // convert board to 2d
        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                this._board[i][j] = gameState.board[(this._size * i) + j];
            }
        }
        
        // check if lost
        if (!areMovesPossible(this._board)) {
            // trigger lose event
            this._over = true;
            emit('onLose', this);
        }
    }

    move(direction) {
        switch (direction) {
            case 'right':
                this.moveRight();
                break;
            case 'left':
                this.moveLeft();
                break;
            case 'down':
                this.moveDown();
                break;
            case 'up':
                this.moveUp();
                break;
        }

        // check if won
        if (this._won) {
            // trigger won event
            emit('onWin', this);
        }

        // add random tile
        addTile(this._board);

        // check if lost
        if (!areMovesPossible(this._board)) {
            // trigger lose event
            this._over = true;
            emit('onLose', this);
            return;
        }

        // trigger move event
        emit('onMove', this);
    }

    get gameState() {
        return {
            board: [].concat(...this._board),
            score: this._score,
            won: this._won,
            over: this._over
        };
    }

    getGameState() {
        return this.gameState;
    }

    onMove(callback) {
        this._onMove.push(callback);
    }

    onWin(callback) {
        this._onWin.push(callback);
    }

    onLose(callback) {
        this._onLose.push(callback);
    }

    toString() {
        let s = [];

        for (let i = 0; i < this._board.length; i++) {
            let parsed = [];

            for (let j = 0; j < this._board[i].length; j++) {
                if (this._board[i][j])
                    parsed.push(this._board[i][j]);
                else
                    parsed.push(' ');
            }

            s[i] = '[' + parsed.join('] [') + ']';
        }

        return s.join('\n');
    }

    moveLeft() {
        for (let i = 0; i < this._size; i++) {
            // retreive nonzero tiles and combine
            let tiles = this._board[i].filter(x => x);
            const t = combineTiles(tiles.reverse(), this);

            // put tiles back into array
            for (let j = 0; j < this._size; j++) {
                if (j < t.length)
                    this._board[i][j] = t[j];
                else
                    this._board[i][j] = 0;
            } 
        }
    }

    moveRight() {
        for (let i = 0; i < this._size; i++) {
            // retreive nonzero tiles and combine
            const tiles = this._board[i].filter(x => x);
            const t = combineTiles(tiles, this).reverse();

            // put tiles back into array
            let numZeroes =  this._size - t.length;
            for (let j = 0; j < this._size; j++) {
                if (j < numZeroes)
                    this._board[i][j] = 0;
                else
                    this._board[i][j] = t[j - numZeroes];
            }
        }
    }

    moveUp() {
        const transpose = this._board[0].map((col, i) => this._board.map(row => row[i]));

        for (let i = 0; i < this._size; i++) {
            // retreive nonzero tiles and combine
            let tiles = transpose[i].filter(x => x);
            const t = combineTiles(tiles.reverse(), this);

            // put tiles back into array
            for (let j = 0; j < this._size; j++) {
                if (j < t.length)
                    this._board[j][i] = t[j];
                else
                    this._board[j][i] = 0;
            }
        }
    }

    moveDown() {
        const transpose = this._board[0].map((col, i) => this._board.map(row => row[i]));

        for (let i = 0; i < this._size; i++) {
            // retreive nonzero tiles and combine
            let tiles = transpose[i].filter(x => x);
            const t = combineTiles(tiles, this).reverse();

            // put tiles back into array
            let numZeroes =  this._size - t.length;
            for (let j = 0; j < this._size; j++) {
                if (j < numZeroes)
                    this._board[j][i] = 0;
                else
                    this._board[j][i] = t[j - numZeroes];
            }
        }
    }

 }
