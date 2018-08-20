import React from 'react';
import './styles/SingleChat.css';
import openSocket from 'socket.io-client';
//const socket = openSocket(process.env.REACT_APP_SERVER);

class SingleChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomname: "",
            currentUser: "",
            otherUser: "",
            messages: [],
            messageToSend: "",
            socket: null,
        }
        this.messageRef = React.createRef();
        this.sendMessage = this.sendMessage.bind(this);
        this.updateChat = this.updateChat.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        var newMessages = [];
        if (prevState.messages.length == 0) {
            newMessages = nextProps.messagesToPass;
        }
        else {
            if(prevState.otherUser != nextProps.otheruser) {
                newMessages = nextProps.messagesToPass;
            }
            else {
                newMessages = prevState.messages;
            }    
        }
        return {
            roomname: nextProps.roomname,
            currentUser: nextProps.thisuser,
            otherUser: nextProps.otheruser,
            messages: newMessages,
            messageToSend: prevState.messageToSend,
            socket: nextProps.socket
        }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeypress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeypress, false);
  }
  handleKeypress(press) {
    if (press.keyCode == 13) {
        this.sendMessage();
    }
  }
/*
  componentDidMount() {
      socket.on('update', (message) => {
          alert("update" + message);
          if (message == this.state.roomname) {
              this.updateChat();
              alert('refreshed');
          }
      });
  }
*/
  scrollBottom() {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  updateChat() {
      var data = {
          roomname: this.state.roomname
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
        this.setState({messages: response}, () => this.scrollBottom());
    }))
.catch((err)=> alert(err));
    }
    sendMessage() {
        if (this.state.messageToSend == "") {
            return;
        }
        var data = {
            roomname: this.state.roomname,
            sender: this.state.currentUser,
            message: this.state.messageToSend
        }
        this.setState({messageToSend: ""});
        fetch(process.env.REACT_APP_SERVER + '/newMessage', {
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
      this.setState({ messages: response}, () => this.scrollBottom());
      this.messageRef.current.value = "";
      this.state.socket.emit('reload', this.state.roomname);
  }))
.catch((err)=> alert(err));
  }
  render() {
      return(
          <div className='chat'>
              <div className='header'>
              <h2 className='help'> Chatting with {this.state.otherUser} </h2>
              </div>
              <div className='messages'>
                    <div className='actualMessages'>
                  { this.state.messages.map((messageData, index) =>
                      <div className={(this.state.currentUser == messageData.sender ? 'right' : 'left')}>
                          {messageData.message}
                      </div>

                  )}
                    </div>
                    <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
                    </div>
              </div>
              <div className='messageSubmit'>
                  <div className='messageHolder'>
                  <input className='form-control'
                  ref={this.messageRef}
                            type='text'
                            placeholder='type message here'
                            onChange={event => this.setState({messageToSend: event.target.value})}
                    />
                    </div>
                    <div className='messageSend'>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => this.sendMessage()}
                    > Send Message </button>
                    </div>
                </div>
            </div>
        )
    }


}

export default SingleChat;
