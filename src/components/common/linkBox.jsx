import React, { Component } from 'react';

class LinkBox extends Component {
    render() {
        const { link } = this.props;
        if (!link)
            return null;
        return (
            <div className='mt-4 p-3 bg-primary text-white rounded'>
                <p>{link}</p>
            </div>
        );
    }
}
 
export default LinkBox;