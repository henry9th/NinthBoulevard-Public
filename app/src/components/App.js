import React, { Component } from 'react';
import '../styles/App.css';
import TopNavigation from './navigation/TopNavigation';
import { RingLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';
import Main from './main';
import ReactDom from 'react-dom';
import LoginPage from './login/LoginPage';
import Index from '../index.js';
import openSocket from 'socket.io-client';
const socket = openSocket(process.env.REACT_APP_SERVER);

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
    }



  render() {
    return (
      <div>
        <TopNavigation socket={socket} />
        <div className="App">
            <Main socket={socket} />
        </div>
      </div>

   );
  }
}

export default App;
