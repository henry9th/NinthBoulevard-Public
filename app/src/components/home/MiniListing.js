import React from 'react';
import './styles/MiniListing.css';


class MiniListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      pieceName: '',
      brand: '',
      price: '',
      size: ''
    };
  }

  render() {
    let image = this.props.image;
    let name = this.props.name;
    let brand = this.props.brand;
    let price = this.props.price;
    let size = this.props.size; 

    return(
        <div className="MiniListingContainer" onClick={this.props.customClickEvent}>
          <div id="imagePart">
            <span id="helper"></span><img src={image} id="ListingImage"/>
          </div>
          <div id="descriptionPart">
          <b id="PieceNameText"> {name} </b> <br/> 
          <span id="BrandText"> {brand} </span> <br/> 
          <span id="SizeText"> {size} </span> 
          <span id="PriceText"> ${price} </span>
          </div>
        </div>
              );
            }
   }


export default MiniListing;
