import React from 'react';
import { RingLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';
//import Loading from '../loading/Loading';
import close from '/home/we_admin/final/app/src/components/login/images/close.png';
import './styles/LoginPage.css';
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            loading: true,
        };
        this.login = this.login.bind(this);
    }

    login(){
        if(!this.validateEmail(this.state.email)) {
          this.setState({errorMessage: 'Please enter a valid email'});
            return;
        }

        var data = {
          email : this.state.email,
          password : this.state.password,
        };
        fetch(process.env.REACT_APP_SERVER + '/login', {
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((res) => res.json().then(response => {
	    if (response.success == "true") {
	        this.props.callbackFromParent(response);
	    }
	    else {
            alert(JSON.stringify(response));
 		        this.setState({errorMessage: "Your email and password do not match"})
	    }
        }))
        .catch((err)=> {
alert(err);
  this.setState({errorMessage: "Your email and password do not match"})}) ;

    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    render() {

        return (
            <div className="">
                <div id="loginTop">
                <div id="loginTextContainer">
                <h2>Login</h2>
                </div>
                <div id="imageContainer">
                <img onClick={()=>this.props.closeHandler()} id="closeImage" src={close}/>
                </div>
                </div>
                <div className="form-group">

                    <input
                        className="form-control"
                        type="text"
                        placeholder="email"
                        onChange={event => this.setState({email: event.target.value})}
                    />

                    <br></br>

                    <input
                        className="form-control"
                        type="password"
                        placeholder="password"
                        onChange={event => this.setState({password: event.target.value})}
                    />

                    <br></br>

                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => this.login()}
                    > Login </button>

                </div>

                <div className="error-message">
                  <p> {this.state.errorMessage} </p>
                </div>

            </div>

        );
    }

}

export default LoginPage;
