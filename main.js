/**
 * Course: COMP 426
 * Assignment: a07
 * Author: Hamzah Chaudhry
 */

import Game from "./engine/game.js";


export const update = function(state) {
    $('#score').text(state.score);

    for (let i = 0; i < state.board.length; i++) {
        let tile = state.board[i];
        $(`#row${Math.floor(i / 4) + 1}`).children()[i % 4].childNodes[0].innerHTML = tile;
    }
};

$(document).ready(function () {
    // create new game
    let game = new Game(4);
    update(game.getGameState());

    // set onMove callback
    game.onMove(function(state) {
        update(state);
    });

    // set onLose callback
    game.onLose(function(state) {
        $('#status').text('lost');
    });

    // set onWon callback
    game.onWin(function(state) {
        $('#status').text('won');
    });

    $(document).keydown(function(e) {
        if (e.which == 38) { // up
            game.move('up');
        } else if (e.which == 39) { // right
            game.move('right');
        } else if (e.which == 40) { // down
            game.move('down');
        } else if (e.which == 37) { // left
            game.move('left');
        }
    });

    // reset the game
    $('#root').on('click', '#reset', function(event) {
        event.preventDefault();
        game.setupNewGame();
        $('#status').text('');
        update(game.getGameState());
    });
});