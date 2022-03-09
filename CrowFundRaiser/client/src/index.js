import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {MoralisProvider} from "react-moralis"
import {BrowserRouter} from "react-router-dom"
import {AuthContextProvider} from "./context/AuthContext"
import "./polyfill.js"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <MoralisProvider appId = {process.env.REACT_APP_APP_ID} serverUrl = {process.env.REACT_APP_MORALIS_SERVER_URL}>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
    </MoralisProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
