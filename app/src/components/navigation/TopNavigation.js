import React from 'react';
import { Navbar, Nav, NavItem, Brand, Collapse, NavDropdown, Toggle, MenuItem, Button, FormControl, FormGroup } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { RingLoader } from 'react-spinners';
import Loader from 'react-loader-advanced';
import LoginPage from '../login/LoginPage';
import cookie from 'react-cookie';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import close from '/home/we_admin/final/app/src/components/navigation/images/close.png'
import './styles/TopNavigation.css';

export default class TopNavigation extends React.Component {
    constructor (props) {
      super(props);

    this.state = {
      showModal: false,
      token: cookie.load('userId') || 'guest',
      chatlist: [],
      roomlist: [],
      idlist: [],
      socket: this.props.socket
    };
    this.joinRooms();
    this.changeToGuest = this.changeToGuest.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.visitChat = this.visitChat.bind(this);
 }

  componentDidMount() {
    this.state.socket.on('update', (message) => {
        for(var i = 0; i < this.state.chatlist.length; i++) {
            if (this.state.roomlist[i] == message) {
                //alert('new message from ' + this.state.chatlist[i]);
                this.fireNotification(this.state.chatlist[i], this.state.idlist[i]);
                break;
            }
        }
    });
  }
  fireNotification(user, id) {
    NotificationManager.info("New message from " + user, "", 3000, () => {this.visitChat(id)}, false);
  }

  visitChat(id) {
    window.location = 'http://ninthblvd.com/chat?id=' + id;
/*
    this.context.history.push({
        state: {id: id},
        pathname: '/chat'
      });
    */
//    console.log(this);
  }

  changeToGuest() {
    this.setState({ token: 'guest'});
    this.state.socket.emit('resetRooms', 'logout');
  }
  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({showModal: false});
  }
  joinRooms() {
    if (this.state.token == 'guest') {
        console.log('not in');
        return;
    }
    console.log('joining');
    fetch(process.env.REACT_APP_SERVER + '/getUserChats', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            method: 'GET',
        }).then((res) => res.json().then(response => {
            this.setState({
                chatlist: response.data.usernames,
                roomlist: response.data.roomnames,
                idlist: response.data.userids
            }, () => this.state.socket.emit('join', this.state.roomlist));
          }))
      .catch((err) => {
          alert(err);
    });
  }
  callbackLogin = (token) => {
    this.setState({showModal: false});
    //console.log(this.state.token);
    cookie.save('userId', token, {path: '/'});
    //console.log(this.state.token);
    this.setState({token : token});
    this.joinRooms();
  }

  logout = () => {
        fetch(process.env.REACT_APP_SERVER + '/logout', {
           credentials : 'include',
           headers: {
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
               'Access-Control-Allow-Headers': 'Content-Type'
           },
           method: 'GET',
       }).then((res) => res.text().then(response => {
	    alert(response);
	    cookie.save('userId' , 'guest');
            this.changeToGuest();
       }))
       .catch((err)=>alert(err));
  }

  render() {

    var style = {
      content: {
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        minHeight: '10rem',
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        minWidth: '20rem',
        width: '80%',
        maxWidth: '60rem'
      }
    }

    return(
    <div>

      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'> HOME </Link>
          </Navbar.Brand>
        </Navbar.Header>

      <Nav bsStyle="tabs">

      <NavItem className="NavigationItem">
       <Link to ='/cl' className="NavigationButton">Create Listing</Link>
      </NavItem>

      {this.state.token == "guest" ? null :
      <NavItem className="NavigationItem">
        <Link to ='/profile' className="NavigationButton">My Profile</Link>
      </NavItem>
    }
      {this.state.token == "guest" ? null :
      <NavItem className="NavigationItem">
        <Link to ='/chat' className="NavigationButton">Chat</Link>
      </NavItem>
      }
      {this.state.token == "guest" ? null :
      <NavItem className="NavigationItem">
        <Link to ='/watching' className="NavigationButton">Watching</Link>
      </NavItem>
      }

      <NavItem className="NavigationItem">
        <Link to ='/community' className="NavigationButton"> Community </Link>
      </NavItem>

      <NavItem className="NavigationItem">
        <Link to ='/guide' className="NavigationButton">Guide</Link>
      </NavItem>
      {this.state.token == "guest" ? null :
      <NavItem className="NavigationItem">
        <Link to ='/notifications' className="NavigationButton"> Notifications </Link>
      </NavItem>
      }
      </Nav>

      <Nav pullRight bsStyle="tabs">

      { this.state.token !== "guest" ? null :
       <NavItem className="NavigationItem">
         <button onClick={this.handleOpenModal} className="NavigationButton">Login</button>
       </NavItem>
     }


     { this.state.token === "guest" ? null :
         <NavItem className="NavigationItem">
           <button onClick={this.logout} className="NavigationButton">Logout</button>
         </NavItem>
    }
     { this.state.token !== "guest" ? null :
       <NavItem className="NavigationItem">
         <Link to='/register' className="NavigationButton">Register</Link>
       </NavItem>
    }
     </Nav>

     </Navbar>

     <Modal

          style={style}
           onRequestClose={this.handleCloseModal}
           shouldCloseOnOverlayClick={true}
           shouldCloseOnEsc={true}
           isOpen={this.state.showModal}
           contentLabel="Minimal Modal Example"
        >
        <LoginPage
          closeHandler={this.handleCloseModal}
          callbackFromParent={this.callbackLogin}
          />


      </Modal>
        <NotificationContainer/>

     </div>

    );
  }
}
