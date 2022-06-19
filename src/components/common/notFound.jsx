import React, { Component } from 'react';
const NotFound = () => {
    return ( 
        <div className='container m-5 p-4 '>
            <h2>Oops! Page Not Found.</h2>
            <p>You may try like this { window.location.origin+"/tic-tac-toe"}</p>
        </div>
     );
}
 
export default NotFound;