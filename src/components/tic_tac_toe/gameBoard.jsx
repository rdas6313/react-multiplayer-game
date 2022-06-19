import React, { Component } from 'react';
import Square from './square';

class GameBoard extends Component {
    
    renderSquare(id) {
        const { board, onSquareClick,disabled } = this.props.data;
        return <Square
            id={id}
            value={board[id - 1]}
            onSquareClick={onSquareClick}
            disabled={disabled}
        />
    }
    render() { 
        return (
            <div className='container p-4 m-4 shadow'>
                <div className='board-row'>
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                </div>
            </div>
        );
    }
}
 
export default GameBoard;