const winnerMoves = [
    [1, 2, 3],
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 6, 9],
    [3, 5, 7],
    [4, 5, 6],
    [7, 8, 9]
];
function isThereAnyWinner(board) {
    const winner = winnerMoves.filter(([a, b, c]) => {
        return board[a-1] === board[b-1] && board[a-1] === board[c-1] && board[a-1] !== null;
    })
    return winner.length === 0 ? false : true;
}

function isGameFinished(board) {
    const emptySquares = board.filter((element) => element === null);
    return emptySquares.length === 0 ? true : false;
}


export {
    isGameFinished,
    isThereAnyWinner
};