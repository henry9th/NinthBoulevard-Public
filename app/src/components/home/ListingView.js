import React from 'react';
import ReactDom from 'react-dom';
import MiniListing from './MiniListing';
import cookie from 'react-cookie';
import './styles/ListingView.css';

class ListingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
					listings: [],
					miniListings: null,
          // numCols: cookie.load('numCols') || 5,
          // numRows: cookie.load('numRows') || 3,
					pageNum: 0,
					nextAvailable: true,
          viewType: cookie.load('viewType') || 2, // 0: 1 r 1 c, 1: 1, r 3 c, 2: 2 r, 3 w
          numStringArray: ["One", "Two", "Three"],
          numListingsArray: [1, 3, 8] // corresponds with viewType

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
        // cookie.save('numCols', this.state.numCols);
        // cookie.save('numRows', this.state.numRows);
        cookie.save('viewType', this.state.viewType);
        var shiftNum = 0;
        var numListings = 0;

        var shiftNum = this.state.numListingsArray[this.state.viewType] * this.state.pageNum;
        console.log(shiftNum);

    		var data = {
    			shift: shiftNum,
    			numListings: this.state.numListingsArray[this.state.viewType],
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
			      this.setState({listings: listingsArray, miniListings: null}, () => {this.createMiniListings(); });
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
    var rows = 0;
    var columns = 0;
    if (this.state.viewType == 0) {
        rows = 1;
        columns = 1;
    } else if (this.state.viewType == 1) {
        rows = 1;
        columns = 3;
    } else if (this.state.viewType == 2) {
        rows = 2;
        columns = 4;
    }

		var listingsDivs = [];
		if (this.state.listings == undefined || this.state.listings.length == 0) { // No more listings
			var message = <div>
				<h1>There are no more listings available </h1>
			</div>

			 this.setState({nextAvailable: false, miniListings: message});
             return;
		}

    var miniClassName = "MiniListing " + this.state.numStringArray[this.state.viewType];

		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
				var listing = this.state.listings[(i*columns) + j];
				if (listing !== undefined) {
            //var miniClassName = "MiniListing " + this.state.numStringArray[this.state.numCols] + " " + this.state.numStringArray[this.state.numRows];
				    listingsDivs.push(<div className={miniClassName}> <MiniListing customClickEvent={this.visitListing.bind(this, listing.id)} name={listing.name} size={listing.size} image={listing.image} brand={listing.brand} price={listing.price} /> </div>);
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
			<div className="ListingView">
        <div className="ViewTypeSelect">
            <span className="ViewTypeLabel"> View Type: </span>
            <button
            className="ViewTypeButton"
            onClick={()=> {this.setState({viewType: 0}, ()=>this.getListings());}}>
                One
            </button>

            <button
            className="ViewTypeButton"
            onClick={()=> {this.setState({viewType: 1}, ()=>this.getListings());}}>
                Two
            </button>

            <button
            className="ViewTypeButton"
            onClick={()=> {this.setState({viewType: 2}, ()=>this.getListings());}}>
                Three
            </button>

        </div>

        <div className="OuterContainerListings">
            <div className="AllMiniListings">
				          {this.state.miniListings}
            </div>
        </div>
      </div>
    )
  }

}

export default ListingView;
