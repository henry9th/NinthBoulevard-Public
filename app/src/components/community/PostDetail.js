import React from 'react';
import { Grid, Row, Col, code } from 'react-bootstrap';
import RegisterPage from '../register/RegisterPage';
import ReactModal from 'react-modal';
import up from './images/up.png';
import filledUp from './images/filledUp.png';
import down from './images/down.png';
import filledDown from './images/filledDown.png';
import './styles/PostDetail.css';

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.location.state.id,
      title: "",
      username: "",
      postText: "",
      date: "",
      comments: [],
      link: "",
      comment: "",
      op: false,
      userRating: null, // For storing what the user has saved to be the rating
      rating: 0,
      showModal: false,
      showReplyText: false,
      replyCommentId: "",
      reply: "",
      sortBy: ""
    };
    this.formatDate = this.formatDate.bind(this);
    this.getComments = this.getComments.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.upRating = this.upRating.bind(this);
    this.downRating = this.downRating.bind(this);
    this.cancelRating = this.cancelRating.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.showCommentReply = this.showCommentReply.bind(this);
    this.submitReply = this.submitReply.bind(this);
    this.handleSortSelect = this.handleSortSelect.bind(this);
    this.compare = this.compare.bind(this);
    this.upCommentRating = this.upCommentRating.bind(this);
    this.downCommentRating = this.downCommentRating.bind(this);

    this.getDetails(this.props.location.state.id);

  }

  handleOpenModal () {
      this.setState({ showModal: true });
  }


  handleCloseModal () {
      this.setState({showModal: false});
  }
  formatDate(timestamp) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var convertedDate = new Date(timestamp);
    var readableDate = months[convertedDate.getMonth()] + ' ' + convertedDate.getDate() + ', ' + convertedDate.getFullYear();
    return readableDate;
  }

  getDetails(postId) {
    var data = {
        id : postId
    }
    fetch(process.env.REACT_APP_SERVER + '/postDetails', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Acess-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         var commentsArray = [];
         for (var key in response.data.comments) {
            commentsArray.push(response.data.comments[key]);
         }
         commentsArray.reverse();
         var readableDate = this.formatDate(response.data.date);
            this.setState( {
                title: response.data.title,
                category: response.data.category,
                username: response.data.username,
                postText: response.data.postText,
                date: readableDate,
                link: response.data.link,
                comments: commentsArray,
                op: response.data.op,
                rating: response.data.rating,
                userRating: response.data.userRating
            });

        }))
       .catch((err)=>{
         alert(err);
       });
  }

  compare(a, b) {
    var aRating = a.rating;
    var bRating = b.rating;
    let comparison = 0;
    if (aRating > bRating) {
      comparison = -1;
    } else if (aRating < bRating) {
      comparison = 1;
    }
    return comparison;
  }

  getComments() {
    var data = {
        id : this.state.postId,
    }
    fetch(process.env.REACT_APP_SERVER + '/getComments', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Acess-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         console.log(response);
           var commentsArray = [];
           for (var key in response) {
              commentsArray.push(response[key]);
           }
           commentsArray.reverse();

           if (this.state.sortBy == "rating") {
             commentsArray.sort(this.compare);
           }

            this.setState( {
                comments: commentsArray,
                comment: ""
            });

        }))
       .catch((err)=>{
         alert(err);
       });

  }

  submitComment() {
    if (this.state.comment == "") {
      return;
    }
    var data = {
      id: this.state.postId,
      comment : this.state.comment
    };
    fetch(process.env.REACT_APP_SERVER + '/newPostComment', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
      if (response == "no user") {
        this.handleOpenModal();
        return;
      }
      this.getComments();
    }))
    .catch((err)=> alert(err));

  }

  deletePost() {
    var data = {
      id: this.state.postId,
    };
    fetch(process.env.REACT_APP_SERVER + '/deletePost', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
      this.props.history.push({
        pathname: '/community'
      });
    }))
    .catch((err)=> alert(err));
  }

  deleteComment(commentId) {
    console.log("commentId: " + commentId);
    var data = {
      postId: this.state.postId,
      commentId: commentId
    };
    fetch(process.env.REACT_APP_SERVER + '/deleteComment', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
        console.log("succesfully deleted comment");
        this.getComments();
    }))
    .catch((err)=> alert(err));
  }

  submitReply() {
    this.setState({showReplyText: false});
    var replyText = this.state.reply;
    var commentId = this.state.replyCommentId;

    var data = {
      id: this.state.postId,
      commentId: commentId,
      reply: replyText
    };

    fetch(process.env.REACT_APP_SERVER + '/newCommentReply', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
      console.log("I LOVE");
      console.log(response);
      if (response == "no user") {
        this.handleOpenModal();
        return;
      }
      this.getComments();
    }))
    .catch((err)=> alert(err));
  }

  upRating() {
    var increment;
    if (this.state.userRating === "up") {
      this.cancelRating("up");
      return;
    }

    else if (this.state.userRating === "down") {
        increment = 2;
    } else {
        increment = 1;
    }
    var data = {
      postId: this.state.postId,
      increment: increment
    };
    fetch(process.env.REACT_APP_SERVER + '/upRating', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
        console.log("succesfully incremented");
        this.getDetails(this.state.postId);

    }))
    .catch((err)=> alert(err));
  }


  downRating() {
    var increment;
    if (this.state.userRating === "down") {
      this.cancelRating("down");
      return;
    }

    else if (this.state.userRating === "up") {
       increment = -2;
    } else {
       increment = -1;
    }

    var data = {
      postId: this.state.postId,
      increment: increment
    };
    fetch(process.env.REACT_APP_SERVER + '/downRating', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
        console.log("succesfully decremented");
        this.getDetails(this.state.postId);
    }))
    .catch((err)=> alert(err));
  }


  upCommentRating(comment) {
    var commentId = comment.target.dataset.commentid;
    var userRating = comment.target.dataset.userrating;

    var data = {
      postId: this.state.postId,
      commentId: commentId,
      userRating: userRating
    };

    fetch(process.env.REACT_APP_SERVER + '/upCommentRating', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
        console.log("succesfully incremented comment rating");
        this.getComments();
    }))
    .catch((err)=> alert(err));
  }


  downCommentRating(comment) {

    var data = {
      postId: this.state.postId,
      commentId: comment.target.value
    };
    fetch(process.env.REACT_APP_SERVER + '/downCommentRating', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
        console.log("succesfully decremented");
        this.getComments();
    }))
    .catch((err)=> alert(err));
  }


  cancelRating(upDown) {
    var data = {
      postId: this.state.postId,
      upDown: upDown
    };
    fetch(process.env.REACT_APP_SERVER + '/cancelRating', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => res.json().then(response => {
        console.log("succesfully deleted comment");
        this.getDetails(this.state.postId);
    }))
    .catch((err)=> alert(err));
  }

  showCommentReply(comment) {
    var commentId = comment.target.value;
    this.setState({showReplyText: true, replyCommentId: commentId});
  }

  handleSortSelect(selection) {
    this.setState({sortBy: selection.target.value }, () => this.getComments());
  }


  render() {

    return(

      <div>

          <div className="RatingButtons">
                {this.state.userRating === "up" ?
                <button
                    className="UpButton"
                    type="button"
                    onClick={() => this.upRating()}
                > <img className="PostRatingImage" src={filledUp} /> </button>

                :

                <button
                    className="UpButton"
                    type="button"
                    onClick={() => this.upRating()}
                > <img className="PostRatingImage" src={up} /> </button>
              }
        <br /> <div className="PostRating"> {this.state.rating} </div> <br />

                {this.state.userRating === "down" ?
                <button
                    className="DownButton"
                    type="button"
                    onClick={() => this.downRating()}
                > <img className="PostRatingImage" src={filledDown} /> </button>

                :

                <button
                    className="DownButton"
                    type="button"
                    onClick={() => this.downRating()}
                > <img className="PostRatingImage" src={down} /> </button>
              }
        <br />
        { this.state.op === false ? null :
          <button
              className="DeleteButton"
              type="button"
              onClick={() => this.deletePost()}
          > Delete </button>
        }

        </div>


        <h1 className="title"> {this.state.title} </h1> <br/>
        <h3 className="author"> {this.state.username} </h3>
        <h3 className="date"> {this.state.date} </h3>
        <h2 className="category"> {this.state.category} </h2>
        <p className="postText"> {this.state.postText} </p>


        <textarea
            className="CommentTextBox"
            placeholder="Write a comment..."
            rows="5"
            columns="25"
            onChange={event => this.setState({comment: event.target.value})}
            value={this.state.comment}
        />
        <br />
        <button
            className="SubmitButton"
            type="button"
            onClick={() => this.submitComment()}
        > Submit </button>


       <div className="comments">
            <h3 className="CommentsLabel">Comments</h3>
           <select className="Selector"
            onChange={this.handleSortSelect }
          >
          <option value="">Recent</option>
          <option value="rating">Rating</option>
          </select>

          {this.state.comments.map((comment, index) =>
            <div> <div className="Comment">
            <div className="CommentRatingButtons">
              <button
                  className="UpButton"
                  type="button"
                  onClick={this.upCommentRating}
                  data-commentid={comment.id}
                  data-userrating={comment.userRating}
              > <img className="CommentRatingImage" src={up} /> </button>
            <br />
              <button
                  className="DownButton"
                  type="button"
                  onClick={this.downCommentRating}
                  data-commentid={comment.id}
                  data-userrating={comment.userRating}
                > <img className="CommentRatingImage" src={down} /> </button>
            </div>


              <span className="CommentAuthor"> {comment.username} </span> <span className="CommentDate"> {this.formatDate(comment.date)} </span> <br />
              <p className="CommentText"> {comment.comment} </p> <br />

                <button
                    className="ReplyCommentButton"
                    type="button"
                    value={comment.id}
                    onClick={this.showCommentReply}
                > Reply </button>

                { comment.oc === false ? null :
                <button
                    className="DeleteCommentButton"
                    type="button"
                    onClick={() => this.deleteComment(comment.id)}
                > Delete </button>
              }
                </div>
            { this.state.showReplyText === false || this.state.replyCommentId !== comment.id ? null :
                  <div>
                  <textarea
                      className="ReplyTextBox"
                      placeholder="Write a reply..."
                      rows="3"
                      columns="15"
                      onChange={event => this.setState({reply: event.target.value})}
                  /> <br></br>
                  <button
                      className="ReplySubmitButton"
                      type="button"
                      onClick={() => this.submitReply()}
                  > Submit </button>

                  </div>
                }

                {comment.replies.map((reply, index) =>
                  <div className="Reply">

                    <span className="ReplyAuthor"> {reply.username} </span> <span className="ReplyDate"> {this.formatDate(reply.date)} </span> <br />
                <p className="ReplyText"> {reply.reply} </p> <br />

            </div>  )}
            </div>)
          }
            <br></br>
        </div>

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

export default PostDetail;
