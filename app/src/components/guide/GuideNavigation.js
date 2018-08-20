import React from 'react';
import { Navbar, Nav, NavItem, Brand, Collapse, NavDropdown, Toggle, MenuItem, Button, FormControl, FormGroup } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

//import { Link } from 'react-router-dom';

export default class GuideNavigation extends React.Component {

  render() {
    return(
    <div>

      <Link to='/guide/'>General</Link> {'    '}
      <Link to='/guide/seller'>Seller</Link> {'   '}
      <Link to='/guide/buyer'>Buyer</Link> {'   '}

     </div>

    );
  }
}
