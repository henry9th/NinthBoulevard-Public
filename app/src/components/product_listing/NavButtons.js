import React from 'react';
import './styles/ImageCarousel.css';

export const RightNavButton = (props) => {
  return (
    <button onClick={props.onClick}  type="button" id="right-button" >
      <i className="fa fa-3x fa-angle-right" aria-hidden="true" style={{marginLeft: '0px'}}> RIGHT </i>
    </button>
  )
}

export const LeftNavButton = (props) => {
  return (
      <button onClick={props.onClick} type="button" id="left-button" >
      <i className="fa fa-3x fa-angle-right" aria-hidden="true" style={{marginLeft: '0px'}}> LEFT </i>
    </button>
  )
}
