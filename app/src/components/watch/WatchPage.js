import React from 'react';
import { Grid, Row, Col, code, Carousel, DropdownButton, DropdownInput, ButtonToolbar, MenuItem } from 'react-bootstrap';
import WatchingView from './WatchingView';
import StoreCarousel from './StoreCarousel';
import { Switch, Route, Link} from 'react-router-dom';
import MiniStore from './MiniStore';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      stores: []
    };

  }


  getStores() {
    fetch(process.env.REACT_APP_SERVER + '/getStores', {
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        method: 'GET',
    }).then((res) => res.json().then(response => {
        console.log(response);
        var storesArray = [];
      for (var key in response) {
        if (response.hasOwnProperty(key)){
            storesArray.push(response[key]);
        }
      }
      this.setState({stores: storesArray}, () => this.render());
    }))
    .catch((err)=> alert(err));

  }

  render() {

    return(
      <div>
        <Link to='/watching'>Items</Link> {'    '}
        <Link to='/watching/shops'>Shops</Link> {'   '}

        <Grid>
          <Row className="show-grid">

            <Col xs={10} md={20}>
                <main>
                  <Switch>
                    <Route path='/watching' render={(props) => (
                      <WatchingView />
                    )}/>

                    <Route path='/shops' render={(props) => (
                      <StoreCarousel ref={(ref) => this.storeCarousel=ref} index={0} storesList={this.state.stores} data={this.props} />
                    )}/>

                  </Switch>
                </main>


            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}



export default Home;
