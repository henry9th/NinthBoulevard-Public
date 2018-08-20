import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BuyerGuide from './BuyerGuide';
import SellerGuide from './SellerGuide';
import GeneralGuide from './GeneralGuide';
import GuideNavigation from './GuideNavigation';
import './styles/Guide.css';



// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const contentStyle = {
  maxWidth: "600px",
  width: "90%"
};

const Guide = () => (
  <div className="Guide">
  <GuideNavigation />

  <main>
    <Switch>
      <Route exact path='/guide' component={GeneralGuide}/>
      <Route path='/guide/seller' component={SellerGuide}/>
      <Route path='/guide/buyer' component={BuyerGuide}/>
    </Switch>
  </main>
  </div>
)

export default Guide;
