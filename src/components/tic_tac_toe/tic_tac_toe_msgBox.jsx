import React, { Component } from 'react';
class Tic_Tac_Toe_MsgBox extends Component {
    
    render() { 
        const { msg } = this.props;
        return (
            <div className='container p-2 mt-4 '>
                <h5>{msg}</h5>
            </div>
        );
    }
}
 
export default Tic_Tac_Toe_MsgBox;