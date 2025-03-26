function createPlayer(name, symbol, turn) {

    const getName = () => name;
    const getSymbol = () => symbol;
    const getTurn = () => turn;
    const changeTurn = () => turn = !turn;

    return { getName, getSymbol, getTurn, changeTurn };
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



    return { tiles, checkRound }
}

function createTicTacToe(playerOne, playerTwo) {
    let roundCounter = 0;
    let inPlay = true;

    let board = createGameBoard();

    const playTurn = (tile) => {
        roundCounter++;
        let currPlayer;
        playerOne.getTurn() ? currPlayer = playerOne : currPlayer = playerTwo;
        let symbol = currPlayer.getSymbol();
        board.tiles[tile].claimTile(symbol);

        let won = board.checkRound();

        if (won || roundCounter == 9) {
            if (won) {
                inPlay = false;
                return (currPlayer.getName() + ' has won!');
            } else {
                inPlay = false;
                return 'Tie!';
            }
        } else {
            playerOne.changeTurn();
            playerTwo.changeTurn();
        }
    }


    const isInPlay = () => inPlay;

    return { board, playTurn, isInPlay };

};

const DOMGame = (function() {
    let game;
    let container = document.querySelector('.container');
    const newGameBtn = document.querySelector('.new-game');
    const newGameForm = document.querySelector('.game-form');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.querySelector('.submit');
    newGameBtn.addEventListener('click', () => { newGameForm.show(); });
    closeBtn.addEventListener('click', () => { newGameForm.close(); event.preventDefault(); });
    submitBtn.addEventListener('click', (eventA) => { submitBtnClick(event); });

    const submitBtnClick = (event) => {
        event.preventDefault();
        let p1name = document.querySelector('#p1name');
        let p1symbol = document.querySelector('#p1symbol')
        let p2name = document.querySelector('#p2name');
        let p2symbol = document.querySelector('#p2symbol');

        let playerOne = createPlayer((p1name.value || 'Player One'), (p1symbol.value || 'X'), true);
        let playerTwo = createPlayer((p2name.value || 'Player Two'), (p2symbol.value || 'O'), false);
        if (playerOne.getSymbol() == playerTwo.getSymbol()) {
            alert(playerOne.getName() + ' and ' + playerTwo.getName() + ' cannot have the same symbol.');
        } else if (playerOne.getSymbol().length > 1 || playerTwo.getSymbol().length > 1) {
            alert('Symbols cannot exceed 1 character in length.');
        } else {
            newGameForm.close();
            game = createTicTacToe(playerOne, playerTwo);
            p1name.value = '';
            p1symbol.value = '';
            p2name.value = '';
            p2symbol.value = '';

            displayBoard();
        }
    }


    const displayBoard = () => {
        let display = document.querySelector('.board');
        display.innerHTML = '';

        let tiles = game.board.tiles;
        for (let tile of tiles) {
            let displayTile = createTileDOM(tile)
            display.appendChild(displayTile);
        }
    }

    const createTileDOM = (tile) => {
        let displayTile = document.createElement('button');
        displayTile.className = 'tile'
        displayTile.textContent = '';
        displayTile.addEventListener('click', () => {
            if (game.isInPlay() && !tile.claimed()) {
                let result = game.playTurn(tile.index);
                displayTile.textContent = tile.getSymbol();
                if (result != undefined) {
                    displayResults(result);
                }
            }
        });
        return displayTile;
    }


    let results = document.querySelector('.results');
    const displayResults = (result) => {
        let newResult = document.createElement('h2');
        newResult.textContent = result;
        results.appendChild(newResult);
    }


})();
