import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateListing from './create_listing/CreateListing';
import ProductList from './product_listing/ProductList';
import RegisterPage from './register/RegisterPage';
import LoginPage from './login/LoginPage';
import SelfProfile from './profile/SelfProfile';
import { RingLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';
import Guide from './guide/Guide';
import Home from './home/Home';
import App from './App'
import WatchPage from './watch/WatchPage';
import Community from './community/Community';
import VerifyPage from './email_verify/VerifyPage';
import ChatPage from './chat/ChatPage';
import NotificationPage from './notifications/NotificationPage';
// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
class Main extends React.Component{
  constructor (props) {
    super(props);

        this.state = {
            socket: this.props.socket,
        };
    }
    
        
    
    render(){

      const contentStyle = {
        maxWidth: "600px",
        width: "90%"
      };

      return (
        <main>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/profile' component={SelfProfile}/>
            <Route path='/cl' component={CreateListing}/>
            <Route path='/linkproduct' component={ProductList}/>
            <Route path='/login' component={LoginPage}/>
            <Route path='/register' component={RegisterPage}/>

            <Route path='/register'
                      //component={RegisterPage}
                component={() => <RegisterPage overlayCLInfo={this.props.overlayAppsInfo.bind(this)}/>}
                    />
            <Route path='/guide' component={Guide}/>
            <Route path='/watching' component={WatchPage}/>
            <Route path='/community' component={Community}/>
            <Route path='/verify' component={VerifyPage}/>
            <Route path='/chat' render={props => <ChatPage socket={this.state.socket} {...props}/>} />
            <Route path='/notifications' component={NotificationPage}/>
            </Switch>
        </main>
     );
    }
    }

    export default Main;
