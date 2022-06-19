import React, { Component } from 'react';

class Square extends Component {
    render() { 
        const { id, value, onSquareClick, disabled } = this.props;
        return (
            <button
                className='square'
                onClick={() => !disabled ? onSquareClick(id) : null}
            >
                {value}
            </button>
        );
    }
}
 
export default Square;