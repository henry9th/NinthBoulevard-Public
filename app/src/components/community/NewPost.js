import React from 'react';
import RegisterPage from '../register/RegisterPage';
import ReactModal from 'react-modal';
import './styles/NewPost.css';

class NewPost extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      category: "",
      postText: "",
      link: "",
      showModal: false
    };
    this.submitPost = this.submitPost.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal () {
      this.setState({ showModal: true });
  }


  handleCloseModal () {
      this.setState({showModal: false});
  }


  submitPost() {
    if (this.state.title == "" || this.state.category == "" || this.state.postText == "") {
      return;
    }

    var data = {
      title : this.state.title,
      category: this.state.category,
      postText : this.state.postText,
      link : this.state.link
    };
    fetch(process.env.REACT_APP_SERVER + '/newPost', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.text().then(response => {
      console.log(response);
        if (response == "no user") {
          this.handleOpenModal();
          return;
        }
        this.props.history.push("/community");

      }))
    .catch((err)=>{ alert(err); });

  }

  render() {

    return(
      <div id="NewPostDiv" >

        <h1 id="PostTitleText"> {this.state.title || "Submit New Post"} </h1>
        <span id="CategoryText"> {this.state.category} </span>

        <input
            id="TitleInput"
            className="form-control"
            type="text"
            placeholder="Title"
            onChange={event => this.setState({title: event.target.value})}
        />

        <select
          id="CategorySelect"
          className="form-control"
          onChange={event => this.setState({category: event.target.value})}
        >
          <option className="CategoryOptions" selected="selected" value="">Select Category</option>
          <option className="CategoryOptions" value="WDYWT">WDYWT</option>
          <option className="CategoryOptions" value="Legit Check">Legit Check</option>
          <option className="CategoryOptions" value="Question">Question</option>
          <option className="CategoryOptions" value="Searching">Searching</option>
        </select>

        <br></br>

        <textarea
            id="PostTextArea"
            className="form-control"
            placeholder="Description"
            rows="10"
            columns="50"
            onChange={event => this.setState({postText: event.target.value})}
        />

        <br></br>

        <input
            id="ImgurLinkInput"
            className="form-control"
            type="url"
            placeholder="imgur link"
            onChange={event => this.setState({link: event.target.value})}
        />

        <br></br>

        <button
            id="SubmitButton"
            className="btn btn-primary"
            type="button"
            onClick={() => this.submitPost()}
        > Submit </button>

        <ReactModal
            onRequestClose={this.handleCloseModal}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
        >
            <RegisterPage />
            <button onClick={this.handleCloseModal}>Close Modal</button>

        </ReactModal>
      </div>
    );
  }

}



export default NewPost;
