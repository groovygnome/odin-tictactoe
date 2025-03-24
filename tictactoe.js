function createPlayer(name, move, turn) {

    const getName = () => name;
    const getMove = () => move;
    const getTurn = () => turn;
    const changeTurn = () => turn = !turn;

    return { getName, getMove, getTurn, changeTurn };
}

function createTile(index) {
    let symbol = index;

    const getSymbol = () => {
        return symbol;
    };
    const claimTile = (newSymbol) => {
        if (symbol == index) {
            symbol = newSymbol;
            return true;
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


    const checkRound = () => (
        (tiles[0].getSymbol() === tiles[1].getSymbol() && tiles[1].getSymbol() === tiles[2].getSymbol()) ||
        (tiles[3].getSymbol() === tiles[4].getSymbol() && tiles[4].getSymbol() === tiles[5].getSymbol()) ||
        (tiles[6].getSymbol() === tiles[7].getSymbol() && tiles[7].getSymbol() === tiles[8].getSymbol()) ||
        (tiles[0].getSymbol() === tiles[3].getSymbol() && tiles[3].getSymbol() === tiles[6].getSymbol()) ||
        (tiles[1].getSymbol() === tiles[4].getSymbol() && tiles[4].getSymbol() === tiles[7].getSymbol()) ||
        (tiles[2].getSymbol() === tiles[5].getSymbol() && tiles[5].getSymbol() === tiles[8].getSymbol()) ||
        (tiles[0].getSymbol() === tiles[4].getSymbol() && tiles[4].getSymbol() === tiles[8].getSymbol()) ||
        (tiles[2].getSymbol() === tiles[4].getSymbol() && tiles[4].getSymbol() === tiles[6].getSymbol())
    );

    const displayBoard = () => {
        console.log(tiles[0].getSymbol() + ' | ' + tiles[1].getSymbol() + ' | ' + tiles[2].getSymbol());
        console.log('--------');
        console.log(tiles[3].getSymbol() + ' | ' + tiles[4].getSymbol() + ' | ' + tiles[5].getSymbol());
        console.log('--------');
        console.log(tiles[6].getSymbol() + ' | ' + tiles[7].getSymbol() + ' | ' + tiles[8].getSymbol());
    }

    return { tiles, checkRound, displayBoard }
}

function createTicTacToe(playerOne, playerTwo) {
    let inPlay = true;
    let roundCounter = 0;

    let board = createGameBoard();

    const playTurn = (tile) => {
        if (inPlay) {
            roundCounter++;
            let currPlayer;
            playerOne.getTurn() ? currPlayer = playerOne : currPlayer = playerTwo;
            let symbol = currPlayer.getMove();
            board.tiles[tile].claimTile(symbol);
            displayBoard();

            if (board.checkRound() || roundCounter == 9) {
                if (roundCounter == 9) {
                    console.log('Tie!')
                } else {
                    console.log(currPlayer.getName() + ' has won!');
                }
                inPlay = false;
            } else {
                playerOne.changeTurn();
                playerTwo.changeTurn();
            }
        } else {
            console.log("The game is over, you need to start a new one");
        }
    }

    const displayBoard = () => {
        board.displayBoard();
    }

    const isInPlay = () => { return inPlay; }

    return { board, playTurn, displayBoard, isInPlay };

};

const DOMGame = (function() {
    let gameBoard;
    const newGameBtn = document.querySelector('.new-game');
    const newGameForm = document.querySelector('.game-form');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.querySelector('.submit');
    newGameBtn.addEventListener('click', () => { newGameForm.show(); });
    closeBtn.addEventListener('click', () => { newGameForm.close(); event.preventDefault(); });
    submitBtn.addEventListener('click', () => {
        newGameForm.close();
        event.preventDefault();
        let playerOne = createPlayer(document.querySelector('#p1name').value, document.querySelector('#p1symbol').value, true);
        let playerTwo = createPlayer(document.querySelector('#p2name').value, document.querySelector('#p2symbol').value, false);
        gameBoard = createTicTacToe(playerOne, playerTwo);
        displayBoard();
    });


    const displayBoard = () => {
        let display = document.createElement('div');
        let container = document.querySelector('.container');
        display.className = 'board';

        let tiles = gameBoard.board.tiles;
        for (let tile of tiles) {
            let displayTile = document.createElement('button');
            displayTile.className = 'tile'
            displayTile.textContent = '';
            displayTile.addEventListener('click', () => {
                if (gameBoard.isInPlay()) {
                    gameBoard.playTurn(tile.index);
                    displayTile.textContent = tile.getSymbol();
                }
            });
            display.appendChild(displayTile);
        }
        container.appendChild(display);
    }
})();
