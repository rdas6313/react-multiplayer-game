import React, { Component } from 'react';
import Tic_Tac_Toe from './components/tic_tac_toe/Tic_Tac_Toe';
import './App.css';
import logo from './logo.svg';



class App extends Component {
    state = {} 
    constructor(props) {
        super(props);
    }
    render() { 
        return (
            <Tic_Tac_Toe />
        );
    }
}
 
export default App;