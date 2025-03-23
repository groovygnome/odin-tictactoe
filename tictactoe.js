function createPlayer(name, move, turn) {

    const getName = () => name;
    const getMove = () => move;
    const getTurn = () => turn;
    const changeTurn = () => turn = !turn;

    return { getName, getMove, getTurn, changeTurn };
}

function createTile(index) {
    let symbol = index;

    const getSymbol = () => symbol;
    const claimTile = (newSymbol) => {
        if (symbol == index) {
            symbol = newSymbol;
        }
    };

    return { index, getSymbol, claimTile };

}

function createGameBoard() {
    let tiles = [];

    for (let i = 0; i < 9; i++) {
        tiles.push(createTile(i));
    }

    /** tiles
     *  [ 0 , 1 , 2
     *    3 , 4 , 5
     *    6 , 7 , 8 ]
    **/
    const checkRound = () => {
        if (
            (tiles[0].getSymbol() == tiles[1].getSymbol() == tiles[2].getSymbol()) ||
            (tiles[3].getSymbol() == tiles[4].getSymbol() == tiles[5].getSymbol()) ||
            (tiles[6].getSymbol() == tiles[7].getSymbol() == tiles[8].getSymbol()) ||
            (tiles[0].getSymbol() == tiles[3].getSymbol() == tiles[6].getSymbol()) ||
            (tiles[1].getSymbol() == tiles[4].getSymbol() == tiles[7].getSymbol()) ||
            (tiles[2].getSymbol() == tiles[5].getSymbol() == tiles[8].getSymbol()) ||
            (tiles[0].getSymbol() == tiles[4].getSymbol() == tiles[8].getSymbol()) ||
            (tiles[2].getSymbol() == tiles[4].getSymbol() == tiles[6].getSymbol())
        ) {
            return true;
        } else {
            return false;
        }
    }

    return { tiles, checkRound }
}

let gameBoard = (function() {
    let playerOne = createPlayer('jeff', 'X', true);
    let playerTwo = createPlayer('jill', 'O', false);

    let board = createGameBoard();

    const playTurn = (tile) => {
        let symbol;
        playerOne.getTurn() ? symbol = playerOne.getMove() : symbol = playerTwo.getMove();
        board.tiles[tile].claimTile(symbol);

        console.log(board.checkRound());


        playerOne.changeTurn();
        playerTwo.changeTurn();
    }

    const displayBoard = () => {
        console.log();

    }

    return { playerOne, playerTwo, board, playTurn };

})();
