import React from 'react';
import ReactDom from 'react-dom';
import './styles/ImageCarousel.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

class ImageCarousel extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        index: 0,
        direction: null,
        numItems: props.images.length,
        sliding: false
    };
  }

    render() {
      const test = <div> <img src="https://picsum.photos/200/300" /> </div>
      var imagesArr = [];
      this.props.images.map(image => {
          imagesArr.push(<div> <img id="CarouselImage" src={image}/> </div>);
      });


        return (
          <div id="ImageCarouselDiv">

            <Carousel
              id="ImageCarousel"
              useKeyboardArrows={true}
              infiniteLoop={true}
              showStatus={false}
              >
                {imagesArr}
            </Carousel>

          </div>
        );
    }

}

export default ImageCarousel;
