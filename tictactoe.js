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
    const claimed = () => (symbol != index);
    const claimTile = (newSymbol) => {
        if (symbol == index) {
            symbol = newSymbol;
            return true;
        }
    };

    return { index, getSymbol, claimTile, claimed };

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
    let roundCounter = 0;
    let inPlay = true;

    let board = createGameBoard();

    const playTurn = (tile) => {
        roundCounter++;
        let currPlayer;
        playerOne.getTurn() ? currPlayer = playerOne : currPlayer = playerTwo;
        let symbol = currPlayer.getMove();
        board.tiles[tile].claimTile(symbol);
        displayBoard();
        console.log(board.checkRound());

        if (board.checkRound() || roundCounter == 9) {
            if (roundCounter == 9) {
                inPlay = false;
                return 'Tie!'
            } else {
                inPlay = false;
                return (currPlayer.getName() + ' has won!');
            }
        } else {
            playerOne.changeTurn();
            playerTwo.changeTurn();
        }
    }

    const displayBoard = () => {
        board.displayBoard();
    }

    const isInPlay = () => inPlay;

    return { board, playTurn, displayBoard, isInPlay };

};

const DOMGame = (function() {
    let gameBoard;
    let container = document.querySelector('.container');
    const newGameBtn = document.querySelector('.new-game');
    const newGameForm = document.querySelector('.game-form');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.querySelector('.submit');
    newGameBtn.addEventListener('click', () => { newGameForm.show(); });
    closeBtn.addEventListener('click', () => { newGameForm.close(); event.preventDefault(); });
    submitBtn.addEventListener('click', () => {
        newGameForm.close();
        event.preventDefault();
        let p1name = document.querySelector('#p1name').value || 'Player One';
        let p1symbol = document.querySelector('#p1symbol').value || 'X';
        let p2name = document.querySelector('#p2name').value || 'Player Two';
        let p2symbol = document.querySelector('#p2symbol').value || 'O';

        let playerOne = createPlayer(p1name, p1symbol, true);
        let playerTwo = createPlayer(p2name, p2symbol, false);
        gameBoard = createTicTacToe(playerOne, playerTwo);
        p1name.value = '';
        p1symbol.value = '';
        p2name.value = '';
        p2symbol.value = '';
        displayBoard();
    });


    const displayBoard = () => {
        let display = document.querySelector('.board');
        display.innerHTML = '';

        let tiles = gameBoard.board.tiles;
        for (let tile of tiles) {
            let displayTile = document.createElement('button');
            displayTile.className = 'tile'
            displayTile.textContent = '';
            displayTile.addEventListener('click', () => {
                if (gameBoard.isInPlay() && !tile.claimed()) {
                    let result = gameBoard.playTurn(tile.index);
                    displayTile.textContent = tile.getSymbol();
                    if (result != undefined) {
                        displayResults(result);
                    }
                }
            });
            display.appendChild(displayTile);
        }
    }

    let results = document.querySelector('.results');
    const displayResults = (result) => {
        let newResult = document.createElement('h2');
        newResult.textContent = result;
        results.appendChild(newResult);
    }
})();
