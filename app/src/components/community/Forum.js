import React from 'react';
import {Link} from 'react-router-dom';
import './styles/Forum.css';
import back from './images/back.png';
import forward from './images/forward.png';

class Forum extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pageNum: 0,
      postsPerPage: 3,
      category: "",
      sortBy: "date"
    };

    this.getPosts = this.getPosts.bind(this);
    this.visitPost = this.visitPost.bind(this);
    this.leftPost = this.leftPost.bind(this);
    this.rightPost = this.rightPost.bind(this);
    this.searchByCategory = this.searchByCategory.bind(this);
    this.handleSortSelect = this.handleSortSelect.bind(this);
    this.handleCategorySelect = this.handleCategorySelect.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getPosts();
  }

getPosts() {
  var shiftNum = this.state.postsPerPage * this.state.pageNum;

  var data = {
    shift: shiftNum,
    postsPerPage: this.state.postsPerPage,
    category: this.state.category,
    sortBy: this.state.sortBy
  };

  fetch(process.env.REACT_APP_SERVER + '/getPosts', {
      credentials : 'include',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
          'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }).then((res) => res.json().then(response => {
    var postsArray = [];
    for (var key in response) {
      if (response.hasOwnProperty(key)){
          postsArray.push(response[key]);
      }
    }
    this.setState({posts: postsArray}, () => this.render());
  }))
  .catch((err)=> alert(err));
}

formatDate(timestamp) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var convertedDate = new Date(timestamp);
    var readableDate = months[convertedDate.getMonth()] + ' ' + convertedDate.getDate() + ', ' + convertedDate.getFullYear();
    return readableDate;
  }


searchByCategory( {target} ) {
  var inputCategory = target.value;

  this.setState({category: inputCategory});
  var shiftNum = this.state.postsPerPage * this.state.pageNum;

  var data = {
    shift: shiftNum,
    postsPerPage: this.state.postsPerPage,
    category: inputCategory
  };

  fetch(process.env.REACT_APP_SERVER + '/getPosts', {
      credentials : 'include',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
          'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }).then((res) => res.json().then(response => {
      var postsArray = [];
    for (var key in response) {
      if (response.hasOwnProperty(key)){
          postsArray.push(response[key]);
      }
    }
    this.setState({posts: postsArray}, () => this.render());
  }))
  .catch((err)=> alert(err));
}

visitPost(postId) {
  this.props.history.push({
    state: {id: postId},
    pathname: '/community/post'
  });
}

leftPost() {
  var shiftNum = this.state.postsPerPage * (this.state.pageNum-1);

  var data = {
    shift: shiftNum,
    postsPerPage: this.state.postsPerPage,
    category: this.state.category
  };

  fetch(process.env.REACT_APP_SERVER + '/getPosts', {
      credentials : 'include',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
          'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }).then((res) => res.json().then(response => {
      var postsArray = [];
    for (var key in response) {
      if (response.hasOwnProperty(key)){
          postsArray.push(response[key]);
      }
    }
    this.setState({posts: postsArray, pageNum: this.state.pageNum - 1}, () => this.render());
  }))
  .catch((err)=> alert(err));

}

rightPost() {
  var shiftNum = this.state.postsPerPage * (this.state.pageNum+1);
  var data = {
    shift: shiftNum,
    postsPerPage: this.state.postsPerPage,
    category: this.state.category
  };

  fetch(process.env.REACT_APP_SERVER + '/getPosts', {
      credentials : 'include',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
          'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }).then((res) => res.json().then(response => {
      var postsArray = [];
    for (var key in response) {
      if (response.hasOwnProperty(key)){
          postsArray.push(response[key]);
      }
    }
    this.setState({posts: postsArray, pageNum: this.state.pageNum + 1 }, () => this.render());
  }))
  .catch((err)=> alert(err));
}

handleCategorySelect(selection) {
  this.setState({category: selection.target.value}, () => this.getPosts());
}

handleSortSelect(selection) {
  this.setState({sortBy: selection.target.value }, () => this.getPosts());
}


  render() {

    return(
      <div>
        <div className="NewPost"> <Link to ='/community/newPost'>New Post</Link> <b className="clear">&nbsp;</b> </div>

        <div className="Selectors">
          <select className="Select1" value={this.state.category}
            onChange={this.handleCategorySelect}
          >
            <option selected="selected" value="">Search by Category</option>
            <option value="WDYWT">WDYWT</option>
            <option value="Legit Check">Legit Check</option>
            <option value="Question">Question</option>
            <option value="Searching">Searching</option>
          </select>

          <select className="Select2"
            onChange={this.handleSortSelect }
          >
            <option value="date">Recent</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div className="PostView">
          {this.state.posts.map((post, index) =>
            <div className="Post" key={index}>
              <p className="PostTitle"  onClick={
              () => this.visitPost(post.id)}> {post.title} </p> <br /> 
              <p className="CategoryText" onClick={()=>this.setState({category: post.category}, ()=>this.getPosts())}> {post.category} </p> <br />
              <span className="UsernameText"> {post.username} </span> <span className="DateText"> {this.formatDate(post.date)} </span>
            </div>)}

        </div>
        <div className="Navigation"> 
        <button
            className="Button"
            type="button"
            onClick={() => this.leftPost()}
            disabled={this.state.pageNum === 0}
        > <img className="ButtonImage" src={back}/> </button>
        <span className="PageNum"> {this.state.pageNum} </span>       

        <button
            className="Button"
            type="button"
            onClick={() => this.rightPost()}
        > <img className="ButtonImage" src={forward} />  </button> 
    </div>
      </div>
    );
  }

}



export default Forum;
