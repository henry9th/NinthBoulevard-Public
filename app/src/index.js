import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import TopNavigation from './components/navigation/TopNavigation';
import Main from './components/main';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { RingLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';

class Index extends Component {

  constructor() {
     super();
     this.state = {
         loading: true,
         overlay: false
     };
     this.overlayFinalStatus = this.overlayFinalStatus.bind(this);
   }

   overlayFinalStatus(status){
     this.setState({
       overlay: status
     })
   }

  render(){

    const spinner =
       <span>
          <div className="LoadingStyle">
            <RingLoader
              color={'#123abc'}
              loading={this.state.loading}
            />
          </div>
        </span>;

    return(
      <BrowserRouter>
      <Loader show={this.state.overlay} message={spinner}>
          <App asdf={this.overlayFinalStatus}/>
          </Loader>
      </BrowserRouter>

    );
  }
}

ReactDOM.render(
    <Index />,
    document.getElementById('root'));

registerServiceWorker();
