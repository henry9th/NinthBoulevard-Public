import React from 'react';
import ReactDom from 'react-dom';
import StarRatings from 'react-star-ratings'

class MiniProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            image: "",
            sellRating : 5,
            buyRating : 5,
            sellCount: "",
            buyCount: "",
            id: this.props.id,
    };
    this.getProfile();
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

           this.setState({
             username: response.data.username,
             image: response.data.image,
           });

         }))
         .catch((err)=>alert(err));
    }


    render() {
        return (
            <div className="Profile">

                <img src={this.state.image} width="200" height="200" />
                {/*
                <div className="ratings">Sell Rating: {this.state.sellRating} Buy Rating: {this.state.buyRating}</div>
                <div className="count">Products Sold: {this.state.sellCount} Products Bought: {this.state.buyCount}</div>
                */}

                { (this.state.id !== "" && this.state.storeAdded === false) ?
                  <button onClick={()=> this.addStoreToWatching()}> Add Store </button> : null
                }
                
                { (this.state.id !== "" && this.state.storeAdded === true) ?
                  <button onClick={()=> this.removeStoreFromWatching()}> Remove Store </button> : null
                }
                <br></br>
                <button onClick={()=> this.visitChat()}>Message Store </button>
                <br></br>
                <h2 className="username"> {this.state.username} </h2>
                <StarRatings
                    rating={this.state.sellRating}
                />
                <StarRatings
                    rating={this.state.buyRating}
                />
                <h2 className="name"> {this.state.firstName} {this.state.lastName}</h2>
                <h3 className="createDate"> Member since {this.state.date} </h3>
                <div className="bio"> {this.state.bio} </div>
                <div className="items">
                  <h3> My Items  </h3>
                  <ListingCarousel ref={(ref) => this.listingCarousel=ref} index={0} listingsList={this.state.listings} data={this.props} />
                </div>


            </div>

        );
    }

}

export default MiniProfile;
