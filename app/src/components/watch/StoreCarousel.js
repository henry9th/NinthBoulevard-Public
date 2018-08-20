import React from 'react';
import { Carousel } from 'react-bootstrap';
import ReactDom from 'react-dom';
import MiniStore from './MiniStore';

class StoreCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.right = this.right.bind(this);
        this.left = this.left.bind(this);
        this.handleSlideEnd = this.handleSlideEnd.bind(this);
        this.state = {
          index: 0,
          direction: null,
          numElements: 4,
          numItems: Number.parseInt((this.props.storesList.length+3-1) / 3),
          sliding: false,
          numRows: 1
        }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
        index: nextProps.index,
        numListings: nextProps.storesList.length,
        direction: null,
        numElements: 3,
        numItems: Number.parseInt((nextProps.storesList.length+3-1) / 3),
        sliding: false,
        numRows: 1
    };

    if (this.state.indexindex >= this.state.numItems) {
      this.setState({index: 0 } );
    }

  }

  visitStore = (storeId) => {
    this.props.history.push({
      state: {id: storeId},
      pathname: '/profile'
    });
  }

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

    for (var i = 0; i < this.props.storesList.length/(this.state.numElements * this.state.numRows); i++) {
      var stores = [];
      for (var k = 0; k < this.state.numRows; k++) { // for each row
        for (var j = 0; j < this.state.numElements; j++) { // for each listing within the row
          if ((i*this.state.numElements*this.state.numRows) + (k*this.state.numElements) + j < this.props.storesList.length) {
            var store = this.props.storesList[(i*this.state.numElements*this.state.numRows) + (k*this.state.numElements) + j];
            stores.push(<MiniStore customClickEvent={this.visitStore.bind(this, store.id)} storeName={store.storeName} image={store.image} rating={store.rating} key={(i*this.state.numElements*this.state.numRows) + (k*this.state.numElements) + j}/>);
          } else {
            stores.push(<p key={"p"+j} />); // empty element
          }
        }
        stores.push(<br key={"br"+k} />);
      }
      var carouselItem = <Carousel.Item
        animateIn={true}
        animateOut={true}

      > {stores} </ Carousel.Item>
      pCarouselItems.push(carouselItem);
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

export default StoreCarousel;
