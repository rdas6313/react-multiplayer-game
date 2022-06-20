import React from 'react';
import TicTacToe from './ticTacToe';
import { useParams } from 'react-router-dom';
const TicTacToeWrapper = (props) => {
    const params = useParams();
    const newProps = { ...props, match: params }; 
    return (
        <TicTacToe {...newProps} />
     );
}
 
export default TicTacToeWrapper;