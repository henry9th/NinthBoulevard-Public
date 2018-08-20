import React from 'react';
import { Grid, Row, Col, code, Carousel, DropdownButton, DropdownInput, ButtonToolbar, MenuItem } from 'react-bootstrap';
import Filter from './Filter';
import ListingView from './ListingView';
import Swiper from 'react-id-swiper';

import './styles/Home.css';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      index: 0,
      filter: []
    };

    console.log(this.props.goToChat);
     if (this.props.goToChat == true) {
       this.props.history.push({
         pathname: '/chat',
         state: {id: this.props.id}
       });
     }

    this.callbackFilter = this.callbackFilter.bind(this);
    this.reset = this.reset.bind(this);
  }


  callbackFilter(inputFilter) {
      console.log("filter callback");
      console.log(inputFilter);
      //this.setState({index: 0}, function applyFilter() { this.reset(filter);}.bind(this) );
      this.setState({filter: inputFilter}, () => { console.log(this.state.filter);});
      this.setState({index: 5});
      // this.reset(filter);
  }

  reset(filter) {
    //console.log(JSON.stringify(filter));
    fetch(process.env.REACT_APP_SERVER + '/getFilteredListings', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'POST',
        body: JSON.stringify(filter)
    }).then((res) => res.json().then(response => {
        var listingsArray = [];
      for (var key in response) {
        if (response.hasOwnProperty(key)){
            listingsArray.push(response[key]);
        }

        }

      this.setState({listings: listingsArray}, function checkFinish() { console.log(this.state.listings);}.bind(this));

    })).catch((err)=> alert(err));
}


  render() {

    return(
      <div className="HomeDiv">
        <div className="FilterDiv">
          <Filter filterCall={this.callbackFilter} />
        </div>

        <div className="ListingViewDiv">
          <ListingView data={this.props} filter={this.state.filter}/>
        </div>
    </div>
    );
  }

}



export default Home;
