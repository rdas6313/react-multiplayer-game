import React, { Component } from 'react';
import Tic_Tac_Toe from './Tic_Tac_Toe';
import { useParams } from 'react-router-dom';
const Ttt_Wrapper = (props) => {
    const params = useParams();
    const newProps = { ...props, match: params }; 
    return (
        <Tic_Tac_Toe {...newProps} />
     );
}
 
export default Ttt_Wrapper;