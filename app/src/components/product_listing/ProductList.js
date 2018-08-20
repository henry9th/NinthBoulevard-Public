import React from 'react';
import './styles/ProductList.css';
import { Grid, Row, Col, code } from 'react-bootstrap';
import ImageCarousel from './ImageCarousel';

class ProductListSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listingId: this.props.location.state.listingId,
      pieceName: "",
      brand: "",
      location: "",
      size: "",
      price: "",
      images: new Array(3),
      description: "",
      sellerUsername: "",
      sellerImage: "",
      sellerID: "",
      added: false,
      condition: ""
    };
    this.getDescription(this.props.location.state.listingId);
    this.addToWatching = this.addToWatching.bind(this);
    this.removeFromWatching = this.removeFromWatching.bind(this);
    this.visitProfile = this.visitProfile.bind(this);
  }

  getDescription(listingId) {
    var data = {
        id : listingId
    }
    fetch(process.env.REACT_APP_SERVER + '/listingDetails', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Acess-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
            var newImages = this.state.images;
            newImages[0] = response.data.images.first;
            newImages[1] = response.data.images.second;
            newImages[2] = response.data.images.third;
            this.setState({
                pieceName: response.data.pieceName,
                brand: response.data.brand,
                location: response.data.location,
                size: response.data.size,
                price: response.data.price,
                images: newImages,
                description: response.data.description,
                sellerUsername: response.data.sellerUsername,
                sellerImage: response.data.sellerImage,
                sellerID: response.data.sellerID,
                added: response.data.added,
                condition: response.data.condition
            }, () => console.log(this.state));
            console.log(response.data.sellerImage);
        }))
       .catch((err)=>{
         alert(err);
       });

  }

  addToWatching() {
    this.setState({added: true});
    var data = {
        id : this.state.listingId
    }
    fetch(process.env.REACT_APP_SERVER + '/addToWatching', {
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

  removeFromWatching() {
    this.setState({added: false});

    var data = {
        id : this.state.listingId
    }
    fetch(process.env.REACT_APP_SERVER + '/removeFromWatching', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Acess-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(data)

       }).then((res) => res.json().then(response => {
         //this.setState({added: false}); WHY DOESNT THIS RUN??
        }))
       .catch((err)=>{
         alert(err);
       });
  }




  visitProfile() {
      this.props.history.push({
        state: {id: this.state.sellerID},
        pathname: '/profile'
      });
  }

  purchase(){

  };


  render() {
    return(
      <div id="ProductListDiv">
          <div id="LeftProductListing">
            <ImageCarousel id="ListingImagesCarousel" ref={(ref) => this.imageCarousel=ref} images={this.state.images} />
          </div>

          <div id="RightProductListing">
              <span id="PieceName"> {this.state.pieceName} </span> <br />
              <span id="BrandName"> {this.state.brand} </span>

              <span id="PriceLabel"> ${this.state.price} </span>
              <span id="SizeLabel"> Size {this.state.size} </span>
              <span id="ConditionLabel"> {this.state.condition}/10 </span>

              <br />

              <div id="Description">
                <span id="DescriptionLabel"> Description: </span> <br />
                <span id="DescriptionText"> {this.state.description} </span>
              </div>

              <br />

              { this.state.added === true ? null :
                <button className="WatchingButton" onClick={()=> this.addToWatching()}> Add to Watching </button>
              }

              { this.state.added === false ? null :
                <button className="WatchingButton" onClick={()=> this.removeFromWatching()}> Remove from Watching </button>
              }

              <br />

              <button id="MessageButton"> MESSAGE </button>

              <br />

              <button id="PurchaseButton"> PURCHASE </button>

              <br />
              <div id="SellerInfo" onClick={()=> this.visitProfile()}> <img id="StoreProfImg" src={this.state.sellerImage} width="100" height="100"/> <span id="SellerName">{this.state.sellerUsername}</span><span id="LocationTag">({this.state.location})</span></div>
          </div>

      </div>


    );
  }

}

export default ProductListSection;
