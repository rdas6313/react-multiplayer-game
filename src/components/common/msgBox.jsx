import React, { Component } from 'react';

class MsgBox extends Component {
    state = {  } 
    render() { 
        const { contents, title } = this.props.content;
        
        return (
            <div className='container shadow p-4 m-4'>
                <h1>{title}</h1>
                {contents}
            </div>
        );
    }
}
 
export default MsgBox;