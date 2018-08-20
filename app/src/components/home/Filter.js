import React from 'react';
import { Grid, Row, Col, code, Carousel, DropdownButton, DropdownInput, ButtonToolbar, MenuItem } from 'react-bootstrap';
import './styles/Filter.css';

const categories = ["Tops", "Bottoms", "Footwear", "Outerwear", "Accessories", "Tailoring"];
const categoryList = categories.map((category) =>
  <div>
    <input
      className="Checkbox CategoryCheckbox"
      type="checkbox"
      value={category}
      onClick={this.toggleCheckbox}
      /> {category}
  </div>
);

const conditions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const conditionList = conditions.map((condition) =>
  <div>
    <input
      className="Checkbox Condition"
      type="checkbox"
      value={condition}
      onClick={this.toggleConditionsCheckbox}
      /> {condition}
  </div>
);

const colors = ["Red", "Blue", "Green", "Yellow", "Black", "White"];
const colorList = colors.map((color) =>
  <div>
    <input
      className="Checkbox Color"
      type="checkbox"
      value={color}
      onClick={this.toggleColorsCheckbox}
      /> {color}
  </div>
);

const locations = ["United States", "Canada", "Europe", "Australia"];
const locationList = locations.map((location) =>
  <div>
    <input
      className="Checkbox Location"
      type="checkbox"
      value={location}
      onClick={this.toggleLocationsCheckbox}
      /> {location}
  </div>
);

const tops = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const footwear = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11,5", "12", "12.5"]

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      category:'',
      size: '',
      color:'',
      condition:'',
      location: '',
      minPrice:'',
      maxPrice:'',
    };

    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.toggleCategoriesCheckbox = this.toggleCategoriesCheckbox.bind(this);
    this.toggleConditionsCheckbox = this.toggleConditionsCheckbox.bind(this);
    this.toggleColorsCheckbox = this.toggleColorsCheckbox.bind(this);
    this.toggleLocationsCheckbox = this.toggleLocationsCheckbox.bind(this);
  }


  applyFilter() {
    var filter = {
      search: this.state.search,
      condition: this.state.condition,
      color: this.state.color,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      location: this.state.location,
      category: this.state.category,
      size: this.state.size
    }

    this.props.filterCall(filter);
  }

  resetFilter() {
    this.setState({
      search: '',
      category:'',
      size: '',
      color:'',
      condition:'',
      location: '',
      minPrice:'',
      maxPrice:'',
    })
  }


  toggleCategoriesCheckbox() {

  }

  toggleConditionsCheckbox() {

  }

  toggleColorsCheckbox() {

  }

  toggleLocationsCheckbox() {

  }


render() {
  return(
    <div>
      <div className = "Search">
          <span className="SearchLabel">Search: </span>
          <input
              className="TextSearchInput"
              type="text"
              placeholder="eg Rick Owen, Supreme, etc"
              onChange={event => this.setState({search: event.target.value})}
          />
      </div>

      <div className="Category">
          <span className="SearchCategory">Category: </span>
          <form className="CategoryOptionsList">
              {categoryList}
          </form>
      </div>


      <div className="Size">
          <span className="SizeLabel">Size: </span>
          <ButtonToolbar>
             <DropdownButton title="Size" id="dropdown-size-medium" onSelect={(event) => this.setState({size: event})}>

               <MenuItem eventKey="" value="All Sizes">All</MenuItem>
               <MenuItem eventKey="XXS" value="size is XXS">XXS/40</MenuItem>
               <MenuItem eventKey="XS" value="size is XS">XS/42</MenuItem>
               <MenuItem eventKey="S" value="size is S">S/44-46</MenuItem>
               <MenuItem eventKey="M" value="size is M">M/48-50</MenuItem>
               <MenuItem eventKey="L" value="size is L">L/52-54</MenuItem>
               <MenuItem eventKey="XL" value="size is XL">XL/56</MenuItem>
               <MenuItem eventKey="XXL" value="size is XXL">XXL/58</MenuItem>
             </DropdownButton>
           </ButtonToolbar>
       </div>

       <div className="Condition">
           <span className="ConditionLabel">Condition: </span>

           <ButtonToolbar>
              <DropdownButton title="Condition" id="dropdown-size-medium" onSelect={(event) => this.setState({condition: event})}>
                  <form className="ConditionOptionsList">
                      {conditionList}
                  </form>

              </DropdownButton>
            </ButtonToolbar>
        </div>

        <div className="Color">
            <span className="ColorLabel">Color: </span>

            <ButtonToolbar>
               <DropdownButton title="Color" id="dropdown-size-medium" onSelect={(event) => this.setState({color: event})}>
                   <form className="ColorOptionsList">
                       {colorList}
                   </form>
               </DropdownButton>
             </ButtonToolbar>
         </div>

      <div className = "Price">
            <span className="PriceLabel">Price: </span>
            <input
                className="form-control"
                type="number"
                placeholder="Min Price"
                onChange={event => this.setState({minPrice: event.target.value})}
            />

            <input
                className="form-control"
                type="number"
                placeholder="Max Price"
                onChange={event => this.setState({maxPrice: event.target.value})}
            />
       </div>

       <div className = "Location">
             <span className="LocationLabel">Location: </span>
             <ButtonToolbar>
                <DropdownButton title="Location" id="dropdown-size-medium" onSelect={event => this.setState({location: event})}>
                <form className="LocationOptionsList">
                    {locationList}
                </form>
                </DropdownButton>
              </ButtonToolbar>
        </div>


    <br></br>
    <div className = "SubmitSearch">
      <button className="SubmitSearchButton" onClick={() => this.applyFilter()}> Submit </button>
    </div>

    <br></br>
    <div className = "ResetSearch">
      <button className="ResetSearchButton" onClick={() => this.resetFilter()}> Reset </button>
    </div>


    <div className="search">
      <p> {this.state.search} </p>
    </div>

    <div className="category">
      <p> {this.state.category} </p>
    </div>

    <div className="size">
      <p> {this.state.size} </p>
    </div>

    <div className="size">
      <p> {this.state.location} </p>
    </div>

    </div>

  );
}

}


export default Filter;
