import React from 'react';
import ReactDom from 'react-dom';
import MiniListing from '../home/MiniListing';
import cookie from 'react-cookie';

class OwnListingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
					listings: [],
					miniListings: null,
          numCols: cookie.load('numCols') || 3,
          numRows: cookie.load('numRows') || 3,
					pageNum: 0,
					nextAvailable: true
        }

				this.detectRightLeft = this.detectRightLeft.bind(this);
		    this.componentDidMount = this.componentDidMount.bind(this);
		    this.componentWillUnmount = this.componentWillUnmount.bind(this);
				this.getListings = this.getListings.bind(this);
        this.createMiniListings = this.createMiniListings.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.getListings(this.props.filter);
 }

	getListings(inputFilter) {
        cookie.save('numCols', this.state.numCols);
        cookie.save('numRows', this.state.numRows);
        var shiftNum = this.state.numRows * this.state.numCols * this.state.pageNum;
        console.log(shiftNum);

		var data = {
			shift: shiftNum,
			numListings: this.state.numRows * this.state.numCols,
			filter: inputFilter
		};

		fetch(process.env.REACT_APP_SERVER + '/getListings', {
				credentials : 'include',
				headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
						'Access-Control-Allow-Headers': 'Content-Type'
				},
				method: 'POST',
				body: JSON.stringify(data)
		}).then((res) => res.json().then(response => {
			console.log(response);
			var listingsArray = [];
			for (var key in response) {
				if (response.hasOwnProperty(key)){
						listingsArray.push(response[key]);
				}
			}

            console.log(listingsArray);
			this.setState({listings: listingsArray}, () => {this.createMiniListings(); this.render();});
		}))
		.catch((err)=> alert(err));

	}


	componentDidMount() {
		this.getListings(this.props.filter);
   }

   componentDidUpdate(prevProps) {
     if (prevProps.filter !== this.props.filter) {
       this.setState({pageNum: 0, nextAvailable: true}, () => this.getListings(this.props.filter));
     }
   }

	createMiniListings() {
		var listingsDivs = [];
		if (this.state.listings == undefined || this.state.listings.length == 0) { // No more listings
			var message = <div>
				<h1>There are no more listings available </h1>
			</div>

			 this.setState({nextAvailable: false, miniListings: message});
             return;
		}
		for (var i = 0; i < this.state.numRows; i++) {
			for (var j = 0; j < this.state.numCols; j++) {
				var listing = this.state.listings[(i*this.state.numCols) + j];
				if (listing !== undefined) {
					listingsDivs.push(<MiniListing customClickEvent={this.visitListing.bind(this, listing.id)} name={listing.name} image={listing.image} brand={listing.brand} price={listing.price} />);
				}
			}
			listingsDivs.push(<br />);
		}
		this.setState({miniListings: listingsDivs});
	}

  visitListing(id) {
    var history = this.props.data.history;
    history.push({
      state: {listingId: id},
      pathname: '/linkproduct'
    });
  };

	detectRightLeft(event){

		if(event.keyCode === 37) {
			console.log("left");
			if (this.state.pageNum == 0) {
				return;
			} else {
				this.setState({nextAvailable: true, pageNum: this.state.pageNum - 1}, () => this.getListings(this.props.filter));
			}

		} else if (event.keyCode === 39) {
			console.log("right");
			if (this.state.nextAvailable === false) {
				return;
			} else {
				this.setState({pageNum: this.state.pageNum + 1}, () => this.getListings(this.props.filter));
			}
		}
	}

	componentDidMount(){
		document.addEventListener("keydown", this.detectRightLeft, false);
	}
	componentWillUnmount(){
		document.removeEventListener("keydown", this.detectRightLeft, false);
	}


  render(){

    return(
			<div>
                <div>
				<select
					onChange={event => this.setState({pageNum: 0, numRows: event.target.value}, () => this.getListings(this.props.filter))}
				>
					<option value="">Number of Rows</option>
					{this.state.numRows == 1 ?
                        <option selected='selected' value='1'>1</option> :
                        <option value='1'>1</option>
                    }
                    {this.state.numRows == 2 ?
                        <option selected='selected' value='2'>2</option> :
                        <option value='2'>2</option>
                    }
                    {this.state.numRows == 3 ?
                        <option selected='selected' value='3'>3</option> :
                        <option value='3'>3</option>
                    }
				</select>

				<select
          onChange={event => this.setState({pageNum: 0, numCols: event.target.value}, () => this.getListings(this.props.filter))}
        >
					<option value="">Number of Columns</option>
                    {this.state.numCols == 1 ?
                        <option selected='selected' value='1'>1</option> :
                        <option value='1'>1</option>
                    }
                    {this.state.numCols == 2 ?
                        <option selected='selected' value='2'>2</option> :
                        <option value='2'>2</option>
                    }
                    {this.state.numCols == 3 ?
                        <option selected='selected' value='3'>3</option> :
                        <option value='3'>3</option>
                    }
				</select>
            </div>
				{this.state.miniListings}
      </div>
    )
  }

}

export default OwnListingView;
