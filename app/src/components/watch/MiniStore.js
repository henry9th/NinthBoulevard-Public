import React from 'react';

class MiniStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      storeName: '',
      rating: ''
    };
  }

  render() {
    let image = this.props.image;
    let storeName = this.props.storeName;
    let rating = this.props.rating;

    return(
        <div style={{display: 'inline-block', width: '300px', height: '300px'}} onClick={this.props.customClickEvent}>
          <div>
            <img src={image} width="200" height="300"/>
          </div>
          <b> {storeName} </b>
          <p> {rating} </p>
        </div>
              );
            }
   }


export default MiniStore;
