import React from 'react';
import SingleChat from './SingleChat'
import './styles/ChatPage.css';
import openSocket from 'socket.io-client';
//const socket = openSocket(process.env.REACT_APP_SERVER);
import qs from 'query-string';

class ChatPage extends React.Component {
    constructor(props) {
        super(props);

        var id = ""; 
        var q =  qs.parse(this.props.location.search).id;
        if (q != null) {
            id = q;
        }
        if (typeof(this.props.location.state) != "undefined") {
          id = this.props.location.state.id;
        }
        this.state = {
            status: "",
            error: "",
            otherUserId: id,
            thisusername: 'kevinlee6378',
            chatlist: [],
            roomlist: [],
            idlist: [],
            chatIndex: 0,
            chatHidden: true,
            messagesToPass: [],
            socket: this.props.socket
        };
        this.openChat = this.openChat.bind(this);
        this.createChat(id);
        //this.updateChats();
        this.getCurrentUser();
        this.chatRef = React.createRef();
      }
  joinRooms(id) {
      //this.socket.emit('join', this.state.roomlist);
      if(id != "") {
        for(var i = 0; i < this.state.idlist.length; i++) {
            if (this.state.idlist[i] == id) {
                this.openChat(i);
                break;
            }
        }
      }
  }
  componentDidMount() {
  this.state.socket.on('update', (message) => {
          if (!this.state.chatHidden && this.state.roomlist[this.state.chatIndex] == message) {
              if(typeof this.chatRef != 'undefined' && this.chatRef.current != null) {
                console.log("updating "  + message);
              this.chatRef.current.updateChat();
                }
          }
          else {
              console.log("not in room");
          }

  });
  }

  getCurrentUser() {
      fetch(process.env.REACT_APP_SERVER + '/getUsername', {
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
              'Access-Control-Allow-Headers': 'Content-Type'
            },
            method: 'GET',
        }).then((res) => res.json().then(response => {
            this.setState({thisusername: response.data.username});
        }))
        .catch((err) => {
            alert(err);
        });
    }
    updateChats(id) {
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
            }, () => this.joinRooms(id));
          }))
      .catch((err) => {
          alert(err);
      });
  }
  openChat(index) {
     // socket.emit('reload', this.state.roomlist[index]);
      var data = {
          roomname: this.state.roomlist[index]
      }
      fetch(process.env.REACT_APP_SERVER + '/getChat', {
      credentials : 'include',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
          'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }).then((res) => res.json().then(response => {
      console.log(response);
      this.setState({
          messagesToPass: response,
          chatIndex: index,
          chatHidden: false
        }, () => {
            if(typeof this.chatRef != 'undefined') {
              this.chatRef.current.scrollBottom();
            }
        });
    }))
.catch((err)=> alert(err));
    }
    createChat(id) {
        if (id == "") {
            this.updateChats(id);
            return;
        }
        var data = {
          otherUserId : id,
        };
        fetch(process.env.REACT_APP_SERVER + '/createChatroom', {
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((res) => res.json().then(response => {
            console.log(response);
            this.updateChats(id);
        }))
        .catch((err)=> {
        });
  }
  render() {

      return (
          <div className='ChatPage'>
              <div className="chatWrapper">
              <div className="chatList">
              <h1>My Messages</h1>
              <div className="chatSmallList">
                    {this.state.chatlist.map((name, index) =>
                        <div className='chatPerson'>
                            <h3> {name} </h3>
                            <button
                                className='btn btn-primary'
                                type='button'
                                onClick={()=>this.openChat(index)}
                            >Chat</button>
                        </div>
                    )}
                </div>
                </div>
                {this.state.chatHidden ? null :
                <div className="soloChat">
                        <SingleChat ref ={this.chatRef}
                            thisuser={this.state.thisusername}
                            otheruser={this.state.chatlist[this.state.chatIndex]}
                            roomname={this.state.roomlist[this.state.chatIndex]}
                            socket={this.state.socket}
                            messagesToPass={this.state.messagesToPass}
                        />
                </div>
                }
                </div>
                </div>

        );
    }

}

export default ChatPage;
