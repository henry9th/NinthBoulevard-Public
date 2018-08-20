import './styles/RegisterPage.css';
import React from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import Dropzone from 'react-dropzone';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            username: '',
            password: '',
            confirmPassword: '',
            image: 'https://picsum.photos/200',
            files: [],
            errorMessage: "",
            usernameValid: "form-control valid",
            emailValid: "form-control valid",
	          imageurl: ""
        };

    }
    checkEmail() {
        var data = {
            email: this.state.email
        }
        fetch(process.env.REACT_APP_SERVER + '/checkEmail', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,                    'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         if(response.taken == 'true') {
            //alert("taken");
            this.setState({emailValid: "form-control invalid"});
        }
          else {
            //alert('not taken');
            this.setState({emailValid: 'form-control valid'});
        }
       }))
       .catch((err)=>{
         console.log(err)});
    }

    checkUsername() {
         var data = {
            username: this.state.username
        }
        fetch(process.env.REACT_APP_SERVER + '/checkUsername', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,                    'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         if(response.taken == 'true') {
            //alert("taken");
            this.setState({usernameValid: "form-control invalid"});
        }
          else {
            //alert('not taken');
            this.setState({usernameValid: "form-control valid"});
        }
       }))
       .catch((err)=>{console.log(err)});
    }
    register() {
       this.setState({errorMessage: ""});
       if(!this.validateEmail(this.state.email)) {
           this.setState({errorMessage: "Please enter a valid email"});
           return;
       }

       if (this.state.username === '') {
           this.setState({errorMessage: "Please enter a username"});
           return;
       }

       if(!this.validatePassword(this.state.password)) {
           this.setState({errorMessage: "Please enter a valid password"});
           return;
       }
    
       if (this.state.email != this.state.confirmEmail) { 
            this.setState({errorMessage: "Sorry, your emails do not match."}); 
            return;

        }

       if(this.state.password != this.state.confirmPassword) {
           this.setState({errorMessage: "Sorry, your passwords do not match."});
           return;
       }

       if (this.state.files.length != 0) {
       var file = this.state.files[0];

       var imageData = {
         fileName: file.name,
         fileType: file.type,
       }

       fetch(process.env.REACT_APP_SERVER + '/uploadProf', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,                    'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(imageData)

       }).then((res) => res.text().then(response => {
         this.putPicture(response, file);
       }))
       .catch((err)=>{
         this.setState({errorMessage: "failed."});
         alert(err);
       });
       }
       else {
           this.setState({imageurl : 'https://s3.us-east-2.amazonaws.com/prof-image/default.jpg'}, () => this.createAccountRequest());
       }

    }

    createAccountRequest() {
        var data = { firstName : this.state.firstName,
          lastName : this.state.lastName,
          username : this.state.username,
          email : this.state.email,
          password : this.state.password,
          image : this.state.imageurl
        };
        fetch(process.env.REACT_APP_SERVER + '/register', {
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((res) => res.text().then(response => {this.props.history.push("/"); }))
        .catch((err)=>{alert(err); this.setState({errorMessage: "Account Creation Failed."})});

    }
    putPicture(url, file) {
	fetch(url, {
                headers: {
                        'Access-Control-Allow-Origin' : '*',
			'Content-Type' : file.type,
			'Access-Control-Allow-Headers': 'Content-Type',
			'Origin' : process.env.REACT_APP_DOMAIN
                },
                body: file,
                method: "PUT"
        }).then((response) => response.text())
	.then((responseJson) => {
		var locationUrl = 'https://s3.us-east-2.amazonaws.com/prof-image/' + file.name;
		this.setState({imageurl : locationUrl}, () => this.createAccountRequest());
	})
	.catch((err)=>{
        	alert(err);
        });
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validatePassword(password) {
        var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return re.test(password);
    }


    changeImage(event) {
        this.setState({
            image: event.target.value
        });
    }

    onDrop(droppedFiles) {
        let reader = new FileReader();
        let file = droppedFiles[0];

        reader.onloadend = () => {
          this.setState({
            image: reader.result
          }, ()=> console.log("Done"));
        }
        reader.readAsDataURL(file);

        this.setState({
          files: droppedFiles
        });
    }

    clearImage() {
      this.setState({
        image: "https://picsum.photos/200",
        files: []
      });
    }

    render() {
        return (
            <div className ="RegisterPage">
                <div className="listing-container">
                  <div className="form-inline">

                <h2 className="RegisterLabel">Register</h2>

                <div className="form-group register">

                    <div>
                        <Dropzone className="Dropzone" onDrop={(acc, rej) => {this.onDrop(acc)}}>
                          <img className="DropzoneImg" src= {this.state.image} height="190" width="190" />
                        </Dropzone>

                        <button className="RemoveButton" onClick={() => this.clearImage()}>Remove Image</button>
                   </div>
                    <br></br>
                    <input
                        className={'form-control large ' + this.state.usernameValid}
                        type="text"
                        placeholder="Username"
                        onChange={event => this.setState({username: event.target.value})}
                        onBlur={() => this.checkUsername()}
                    />
                    <br></br>
                    <input
                        className="form-control standard" 
                        type="text"
                        placeholder="First Name"
                        onChange={event => this.setState({firstName: event.target.value})}
                    />


                    <input
                        className="form-control standard"
                        type="text"
                        placeholder="Last Name"
                        onChange={event => this.setState({lastName: event.target.value})}
                    />
                    <br></br>
                    <input
                        className={'form-control standard ' + this.state.emailValid} 
                        type="text"
                        placeholder="Email"
                        onChange={event => this.setState({email: event.target.value})}
                        onBlur={() => this.checkEmail()}
                    />

                    <input
                        className={'form-control standard ' + this.state.emailValid}
                        type="text"
                        placeholder="Confirm your email"
                        onChange={event => this.setState({confirmEmail: event.target.value})}
                        onBlur={() => this.checkEmail()}
                    />
                    <br></br>
                    <input
                        className="form-control standard"
                        type="password"
                        placeholder="Password"
                        onChange={event => this.setState({password: event.target.value})}
                    />
                    <input
                        className="form-control standard"
                        type="password"
                        placeholder="Confirm your password"
                        onChange={event => this.setState({confirmPassword: event.target.value})}
                    />
                    <br></br>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => this.register()}
                    > Register </button>

                </div>

                <div className="error-message">
                  <p> {this.state.errorMessage} </p>
                </div>

                  </div>
                </div>
            </div>

        );
    }

}

export default RegisterPage;
