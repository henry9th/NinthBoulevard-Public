import React from 'react';
import ReactDom from 'react-dom';
import './styles/Profile.css';
import ListingCarousel from '../home/ListingCarousel';
import StarRatings from 'react-star-ratings';
import moment from 'moment';

class SelfProfile extends React.Component {
    constructor(props) {
        super(props);
        var id = "";
        if (typeof(this.props.location.state) != "undefined") {
          id = this.props.location.state.id;
        }
        this.state = {
            username: "",
            firstName: "",
            lastName: "",
            image: "",
            sellRating : 5,
            buyRating : 5,
            sellCount: "",
            buyCount: "",
            bio: "",
            data: "",
            id: id,
            listings: [],
            storeAdded: false,
            selfProfile: true
    };
    this.getProfile();
    this.detectRightLeft = this.detectRightLeft.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.addStoreToWatching = this.addStoreToWatching.bind(this);
    this.removeStoreFromWatching = this.removeStoreFromWatching.bind(this);
  }

  detectRightLeft(event){
    if(event.keyCode === 37) {
      this.listingCarousel.left();
    } else if (event.keyCode === 39) {
      this.listingCarousel.right();
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.detectRightLeft, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.detectRightLeft, false);
  }
  
  visitChat() {
      this.props.history.push({
        state: {id: this.state.id},
        pathname: '/chat'
      });
  } 

  addStoreToWatching() {
    this.setState({storeAdded: true});
    var data = {
        storeUsername : this.state.username
    };

    fetch(process.env.REACT_APP_SERVER + '/addStoreToWatching', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Acess-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         //this.setState({added: true}); WHY DOESNT THIS RUN??
        }))
       .catch((err)=>{
         alert(err);
       });

  }

  removeStoreFromWatching() {
    this.setState({storeAdded: false});
    var data = {
        storeUsername : this.state.username
    };

    fetch(process.env.REACT_APP_SERVER + '/removeStoreFromWatching', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Acess-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         //this.setState({added: true}); WHY DOESNT THIS RUN??
        }))
       .catch((err)=>{
         alert(err);
       });
  }

  getProfile = () => {
    var data = {
      id: this.state.id
    };

    fetch(process.env.REACT_APP_SERVER + '/profile', {
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
           var listingsArray = [];
           for (var key in response.data.listings) {
             if (response.data.listings.hasOwnProperty(key)){
                listingsArray.push(response.data.listings[key]);
              }
           }

           var added = response.data.added;
           if (response.data.added == "self") {
             this.setState({id: ""});
             added = false;
           }

           this.setState({
             username: response.data.username,
             firstName: response.data.first,
             lastName: response.data.last,
             image: response.data.image,
             date: response.data.createDate,
             listings: listingsArray,
             storeAdded: added,
             selfProfile: response.data.selfProfile
           });
           console.log((response));
           console.log(listingsArray);
         }))
         .catch((err)=>alert(err));
    }


    render() {
        return (
            <div className="Profile">
                <div className="photos">
                <img src="https://3milliondogs.com/blog-assets-two/2015/06/o-CORGI-facebook-1024x512.jpg" className="coverPhoto"/>
                <img src="http://www.bravotv.com/sites/nbcubravotv/files/styles/blog-post--computer/public/field_blog_image/2018/04/unleashed-corgi-people-promo.jpg?itok=KOgNn-TD&timestamp=1524257239" className="profilePicture"/>
                <h1 className="username">{this.state.username}</h1>
                </div>
                <div className="ratings">
                <div className="sellRating">
                <h3> Seller Rating </h3>
                <StarRatings
                    rating={this.state.sellRating}
                />
                </div>
                <div className="buyRating">
                <h3> Buyer Rating </h3>
                <StarRatings
                    rating={this.state.buyRating}
                />
                </div>
                </div>
                {/*
                <div className="ratings">Sell Rating: {this.state.sellRating} Buy Rating: {this.state.buyRating}</div>
                <div className="count">Products Sold: {this.state.sellCount} Products Bought: {this.state.buyCount}</div>
                */}
                <div className="buttons">
                { (this.state.id !== "" && this.state.storeAdded === false) ?
                  <button onClick={()=> this.addStoreToWatching()}> Add Store </button> : null
                }
                
                { (this.state.id !== "" && this.state.storeAdded === true) ?
                  <button onClick={()=> this.removeStoreFromWatching()}> Remove Store </button> : null
                }
                {this.state.selfProfile ? null :
                <button onClick={()=> this.visitChat()}>Message Store </button>
                }
                </div>
                <h3 className="createDate"> Member since {moment(this.state.date).format("MMMM Do YYYY")} </h3>
                <div className="bio"> {this.state.bio} </div>
                <div className="items">
                <br></br>
                <br></br>
                <br></br> 
                 <h1> My Items  </h1>
                  <ListingCarousel ref={(ref) => this.listingCarousel=ref} index={0} listingsList={this.state.listings} data={this.props} />
                </div>


            </div>

        );
    }

}

export default SelfProfile;
