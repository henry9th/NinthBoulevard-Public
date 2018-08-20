import React from 'react';
import { Carousel } from 'react-bootstrap';
import ReactDom from 'react-dom';
import MiniListing from './MiniListing';

class ListingCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.right = this.right.bind(this);
        this.left = this.left.bind(this);
        this.handleSlideEnd = this.handleSlideEnd.bind(this);
        this.state = {
          index: 0,
          direction: null,
          numElements: 3,
          numItems: Number.parseInt((this.props.listingsList.length+3-1) / 3),
          sliding: false,
          numRows: 1
        }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
        index: nextProps.index,
        numListings: nextProps.listingsList.length,
        direction: null,
        numElements: 3,
        numItems: Number.parseInt((nextProps.listingsList.length+3-1) / 3),
        sliding: false,
        numRows: 1
    };

    if (this.state.indexindex >= this.state.numItems) {
      this.setState({index: 0 } );
    }

  }


  visitListing(id) {
    var history = this.props.data.history;
    history.push({
      state: {listingId: id},
      pathname: '/linkproduct'
    });
  };

  handleSelect = (selectedIndex, e) => {
    if (this.state.sliding == true) {
      return;
    }
    this.setState({
      index: selectedIndex,
      direction: e.direction,
      sliding: true
    });
  }

  restart = () => {
    this.setState({index: 0});
    console.log(this.state.index);
  }

  right = () => {
    if (this.state.index >= this.state.numItems) {
      this.setState({index: 0 } );
    }

    if (this.state.sliding == true || this.state.index >= this.state.numItems - 1) {
      return;
    }
    this.setState({index: this.state.index+1, sliding: true});
  }

  left = () => {
    if (this.state.index >= this.state.numItems) {
      this.setState({index: 0 } );
    }

    if (this.state.sliding == true || this.state.index === 0) {
      return;
    }
    this.setState({index: this.state.index-1, sliding: true});
  }

  handleSlideEnd = () => {
    this.setState({sliding: false});
  }

  handleNumRows = (e) => {
    this.setState({index: 0, numItems: Number.parseInt((this.state.numListings+3-1) / (3*e.target.value))});
    this.setState({numRows: e.target.value});
  }

  render(){
    const { index, direction } = this.state;

    let listingsData;

    var pCarouselItems = [];

    for (var i = 0; i < this.props.listingsList.length/(this.state.numElements * this.state.numRows); i++) {
      var listings = [];
      for (var k = 0; k < this.state.numRows; k++) { // for each row
        for (var j = 0; j < this.state.numElements; j++) { // for each listing within the row
          if ((i*this.state.numElements*this.state.numRows) + (k*this.state.numElements) + j < this.props.listingsList.length) {
            var listing = this.props.listingsList[(i*this.state.numElements*this.state.numRows) + (k*this.state.numElements) + j];
            listings.push(<MiniListing customClickEvent={this.visitListing.bind(this, listing.id)} name={listing.name} image={listing.image} brand={listing.brand} price={listing.price} key={(i*this.state.numElements*this.state.numRows) + (k*this.state.numElements) + j}/>);
          } else {
            listings.push(<p key={"p"+j} />); // empty element
          }
        }
        listings.push(<br key={"br"+k} />);
      }
      var carouselItem = <Carousel.Item
        animateIn={true}
        animateOut={true}

      > {listings} </ Carousel.Item>
      pCarouselItems.push(carouselItem);

      var swiperItem = <div>
        {listings}
        </div>
    }


    return(
      <div>
      <button value="1" onClick={this.handleNumRows}> 1 </button>
      <button value="2" onClick={this.handleNumRows}> 2 </button>
      <button value="3" onClick={this.handleNumRows}> 3 </button>

      <Carousel
        slide={true}
        indicators={false}
        activeIndex={index}

        onSelect={this.handleSelect}
        interval={null}
        wrap={false}
        onSlideEnd={this.handleSlideEnd}
      >
        {pCarouselItems}
      </Carousel>

      </div>
    )
  }

}

export default ListingCarousel;
