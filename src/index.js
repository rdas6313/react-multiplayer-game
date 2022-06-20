import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route,Routes } from "react-router-dom";
import {init} from './services/remoteService'
import NotFound from './components/common/notFound';
import TicTacToeWrapper from './components/tic_tac_toe/ticTacToeWrapper';

init();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='/:urlParam' element={ <TicTacToeWrapper /> } />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
