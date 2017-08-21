const playerType = {
    ONE: 'yellow',
    TWO: 'red'
}
const COL = 7;
const ROW = 6;

const directionType = {
    // DIR: [X, Y],
    NORTH: [0, -1],
    SOUTH: [0, 1],
    EAST: [1, 0],
    WEST: [-1, 0],
    NORTHEAST: [1, -1],
    NORTHWEST: [-1, -1],
    SOUTHEAST: [1, 1],
    SOUTHWEST: [-1, 1]
}
//We only add half the types to our array. Since we check every cell, checking in opposite cardinals in redundant. 
const directions = [directionType.NORTH, directionType.EAST, directionType.NORTHEAST, directionType.NORTHWEST];

const initialState = {
    board: [[], [], [], [], [], [], []],
    turn: playerType.ONE,
    isWon: false,
    winArr: []
}
Object.freeze(initialState);
let state = { ...initialState };


function generateBoard() {
    const board = document.getElementById('board');
    board.className = '';
    state.turn === playerType.ONE ? board.classList.add(`${playerType.ONE}Turn`) : board.classList.add(`${playerType.TWO}Turn`);
    board.innerHTML = '';
    for (let row = 0; row < ROW; row++) {
        const div = document.createElement('div');
        div.classList.add('row');

        board.appendChild(div);
        for (let col = 0; col < COL; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add(`col${col}`);
            cell.classList.add(`row${row}`);

            if (state.board[col][row] === 0) {
                cell.classList.add(playerType.ONE);
                //cell.appendChild(document.createTextNode('Y'));
            } else if (state.board[col][row] === 1) {
                cell.classList.add(playerType.TWO);
                //cell.appendChild(document.createTextNode('R'));
            }

            isInWinArr(cell, col, row);

            div.appendChild(cell);
        }
    }
    bindCells();
}

function isInWinArr(cell, col, row) {
    for (let i = 0; i < state.winArr.length; i++) {
        if (state.winArr[i].col === col && state.winArr[i].row === row) {
            cell.classList.add('win');
        }
    }
}

function drop(col) {
    const cell = findGravityCell(col);
    if (cell) {
        if (!state.isWon) state.board[cell.stateCell.x][cell.stateCell.y] = state.turn === playerType.ONE ? 0 : 1;
        changeTurn();
    }
}

function checkCells() {
    for (let col = ROW; col >= 0; col--) {
        for (let row = ROW; row >= 0; row--) {
            const cell = state.board[col][row];
            let arr = [];
            for(let dir = 0; dir < directions.length; dir++) {
                if (arr.length === 0) arr = checkCell(cell, col, row, directions[dir], []);
            }
            if (arr.length > 0) {
                state.winArr = arr;
                state.isWon = true;
                return;
            }
        }
    }
}

function checkCell(value, col, row, dir, streak) {
    streak.push({ value, col, row });
    if (streak.length === 4) {
        return streak;
    }

    const nextCol = col + dir[0];
    const nextRow = row + dir[1];
    const nextCell = state.board[nextCol] ? state.board[nextCol][nextRow] : undefined;

    if (typeof nextCell !== 'undefined' && nextCell === value) {
        streak = checkCell(nextCell, nextCol, nextRow, dir, streak);
    } else {
        return [];
    }
    return streak;
}


function bindCells() {
    var classname = document.getElementsByClassName('cell');
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', clickCell, false);
        classname[i].addEventListener('mouseenter', mouseenterCell, false);
        classname[i].addEventListener('mouseleave', mouseleaveCell, false);
    }
}

function clickCell(e) {
    drop(e.target.classList.item(1));
}

function mouseenterCell(e) {
    if (state.isWon) return;
    const col = e.target.classList.item(1);
    const cell = findGravityCell(col);
    if (cell) cell.domCell.classList.add(`${state.turn}Hover`);
}

function mouseleaveCell(e) {
    const col = e.target.classList.item(1);
    const cell = findGravityCell(col);
    if (cell) cell.domCell.classList.remove(`${state.turn}Hover`);
}

function clearBoard() {
    const board = document.getElementById('board');
    board.classList.add('spin');
    window.setTimeout(function () {
        state = { ...initialState, board:  [[], [], [], [], [], [], []] };
        render();
    }
        , 250);
}

/**
 * Gets the bottom most valid cell in a clicked column
 * @param {number} col
 */
function findGravityCell(col) {
    var classname = document.getElementsByClassName(col);
    for (var j = 5; j >= 0; j--) {
        if (classname[j].classList.contains(`row${j}`)) {
            const colIndex = parseInt(col.substring(3));
            if (typeof state.board[colIndex][j] === 'undefined') {
                return { domCell: classname[j], stateCell: { x: colIndex, y: j } };
            }
        }
    }
}

function changeTurn() {
    checkCells();
    if (!state.isWon) {
        state.turn = state.turn === playerType.ONE ? playerType.TWO : playerType.ONE;
    }
    render();

}

function render() {
    document.getElementById('turnPlayer').className = '';
    document.getElementById('turnPlayer').classList.add(state.turn);
    generateBoard();
}

function init() {
    render();
}
init();