import React from 'react';
import { DropdownButton, DropdownInput, ButtonToolbar, MenuItem } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import ImagesUploader from 'react-images-uploader';
import ReactModal from 'react-modal';
import RegisterPage from '../register/RegisterPage';

var searchNames = ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Hobart'];

class CreateListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category:'',
            name: '',
            brand: '',
            type: '',
            size: '',
            price: '',
            location: '',
            image1: 'https://picsum.photos/200',
            image2: 'https://picsum.photos/200',
            image3: 'https://picsum.photos/200',
            image1Preview: '',
            image2Preview: '',
            image3Preview: '',
            showModal: false
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }


    handleCloseModal () {
        this.setState({showModal: false});
    }


    create(){

      var data = {
        category: this.state.category,
        name: this.state.name,
        brand: this.state.brand,
        type: this.state.type,
        size: this.state.size,
        price: this.state.price
      };

      fetch('http://ec2-18-188-186-77.us-east-2.compute.amazonaws.com:3001/createlisting', {
          credentials : 'include',
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'http://ec2-18-188-186-77.us-east-2.compute.amazonaws.com:3001',
              'Access-Control-Allow-Headers': 'Content-Type'
          },
          method: 'POST',
          body: JSON.stringify(data)
      }).then((res) => res.json().then(response => {
        if (response.success == 'true') {
	  alert("listing created");
	}
	else {
	  this.handleOpenModal();
	}
      }))
      .catch((err)=> alert(err));

    }


    render() {
        return (
            <div className="listing-container">
                <div className="form-inline">
                    <h2>Create your listing</h2>
                    <div className="form-group">

                    <input
                        className="form-control"
                        type="text"
                        placeholder="Piece name"
                        onChange={event => this.setState({name: event.target.value})}
                    />

                    <br></br>

                    <ButtonToolbar>
                      <DropdownButton title="Default button" id="dropdown-size-medium">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4">Separated link</MenuItem>
                      </DropdownButton>
                    </ButtonToolbar>

                        <input
                            className="form-control"
                            type="text"
                            placeholder="Piece name"
                            onChange={event => this.setState({name: event.target.value})}
                        />

                        <br></br>

                        <input
                            className="form-control"
                            type="text"
                            placeholder="type"
                            onChange={event => this.setState({type: event.target.value})}
                        />

                        <br></br>

                        <div className="form-group"> {/* filter style tho, customer should be able to type and filter function must work */}
                            <label for="sel1">Select Brand list: </label>
                            <select
                                className="form-control"
                                onChange={event => this.setState({brand: event.target.value})}
                            >
                            <option value="" selected disabled hidden>Choose here</option>
                            <option>Nike</option>
                            <option>Adidas</option>
                            <option>H&M</option>
                            </select>
                        </div>

                        <br></br>

                        <input
                            className="form-control"
                            type="text"
                            placeholder="size"
                            onChange={event => this.setState({size: event.target.value})}
                        />

                        <br></br>


                        <input
                            className="form-control"
                            type="number"
                            placeholder="price"
                            onChange={event => this.setState({price: event.target.value})}
                        />
                        {/*   Execute a JavaScript when a user changes the selected option of a <select> element:*/}

                        <br></br>





          {/*}          <DropdownInput
                        options={searchNames}
                        defaultValue={this.props.initialValue}
                        menuClassName='dropdown-input'
                        onSelect={this.handleSelectName}
                        placeholder='Search...'
                        />

                        <br></br>
                        */}


                    <Dropzone
                       // accept="image/jpeg, image/png"
                        onDrop={(accepted, rejected) => {
                            console.log("accepted: " + JSON.stringify(accepted));
                            console.log("Rejected: " + JSON.stringify(rejected));
                            console.log(JSON.stringify(accepted));
                            let reader = new FileReader();
                            let file = accepted[0];
                            reader.onloadend = () => {
                                this.setState({
                                  image1: reader.result
                                });
                              }
                              reader.readAsDataURL(file)

                            }}
                      >
                        <img src= {this.state.image1} height="200" width="200"></img>
                      </Dropzone>


                    <Dropzone
                        //accept="image/jpeg, image/png"
                        onDrop={(accepted, rejected) => {

                            let reader = new FileReader();
                            let file = accepted[0];
                            reader.onloadend = () => {
                                this.setState({
                                  image2: reader.result

                                });
                              }
                            reader.readAsDataURL(file)

                            }}
                      >
                        <img src= {this.state.image2} height="200" width="200"></img>
                      </Dropzone>

                      <Dropzone
                        //cept="image/jpeg, image/png"
                        onDrop={(file) => {

                            let prev = file[0];
                            this.setState({
                                image3: prev
                            });
                        }}
                      >
                        <img src= {this.state.image3} height="200" width="200"></img>
                      </Dropzone>



                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.create()}
                        > Create </button>

                    </div>
                </div>
                <ReactModal
                    onRequestClose={this.handleCloseModal}
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                >
                    <RegisterPage />
                    <button onClick={this.handleCloseModal}>Close Modal</button>

                </ReactModal>
            </div>
        );
    }

}

