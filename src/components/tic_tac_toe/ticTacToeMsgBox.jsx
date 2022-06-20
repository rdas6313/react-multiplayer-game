import React, { Component } from 'react';
class TicTacToeMsgBox extends Component {
    
    render() { 
        const { msg } = this.props;
        return (
            <div className='container p-2 mt-4 '>
                <h5>{msg}</h5>
            </div>
        );
    }
}
 
export default TicTacToeMsgBox;