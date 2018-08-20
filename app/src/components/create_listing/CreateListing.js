  import React from 'react';
import { DropdownButton, DropdownInput, ButtonToolbar, MenuItem } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import ImagesUploader from 'react-images-uploader';
import ReactModal from 'react-modal';
import RegisterPage from '../register/RegisterPage';
import { RingLoader } from 'react-spinners';
import './styles/CreateListing.css';

import DragSortableList from 'react-drag-sortable'

var searchNames = ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Hobart'];
const sizeLists = {
                None: ['Select Type'],
                Orig: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
                Tops: ['top1', 'top2'],
                Bottoms: ['b1', 'b2'],
                Outwear: ['o1', 'o2'],
                Footwear: ['f1','f2'],
                Tailoring: ['t1', 't2'],
                Accessories: ['a1', 'a2']

}
class CreateListing extends React.Component {
    constructor(props) {
        super(props);

        var listOfDropzone = [
           {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 0)}}>
                   <img src= {"https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png"} height="190" width="190" />
                </Dropzone>
                   <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)},
           {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 1)}}>
           <img src= {"https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png"} height="190" width="190" />
                </Dropzone>
                   <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)},
           {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 2)}}>
           <img src= {"https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png"} height="190" width="190" />
                </Dropzone>
                   <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)},
           {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 3)}}>
           <img src= {"https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png"} height="190" width="190" />
                </Dropzone>
                   <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)}
       ];

        this.state = {
            loading: false,
            name: '',
            brand: '',
            type: '',
            size: '',
            condition: '',
            color: '',
            description: '',
            price: '',
            shippingPrice: '',
            location: '',
            image0: 'https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png',
            image1: 'https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png',
            image2: 'https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png',
            image3: 'https://ezzytoremember.com/wp-content/uploads/2017/10/grade-9.png',
            showModal: false,
            list: listOfDropzone,
	        files: new Array(3),
            imageUrls: ['unhandled', 'unhandled', 'unhandled'],
            dataLists: {
            brand: ['Nike', 'Adidas', 'Supreme', 'Palace', 'OffWhite'],
            type: ['Tops', 'Bottoms', 'Outwear', 'Footwear', 'Tailoring', 'Accessories'],
            condition: [1,2,3,4,5,6,7,8,9,10],
            color: ['Blue', 'Yellow', 'Green', 'Brown', 'Black'],
            location: ['United States', 'Canada', 'Europe', 'Japan', 'China', 'Korea']
            },
            currentSizeList: sizeLists['None']
         };
        this.handleValidity = this.handleValidity.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }


    handleCloseModal () {
        this.setState({showModal: false});
    }

    updateDropzone() {
      var listOfDropzone = [
         {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 0)}}>
                 <img src= {this.state.image0} height="190" width="190" />
              </Dropzone>
                 <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)},
         {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 1)}}>
                 <img src= {this.state.image1} height="190" width="190" />
              </Dropzone>
                 <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)},
         {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 2)}}>
                 <img src= {this.state.image2} height="190" width="190" />
              </Dropzone>
                 <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)},
         {content: (<div><Dropzone onDrop={(acc, rej) => {this.onDrop(acc, 3)}}>
                 <img src= {this.state.image3} height="190" width="190" />
              </Dropzone>
                 <button onClick={() => this.clearImage(0)}>Remove Image</button></div>)}
     ];
     this.setState({list: listOfDropzone});

    }

    onDrop(droppedFiles, i) {

      // CONVERT TO IMAGE URL
        var dynamicKey = "image" + i;
        console.log(dynamicKey);

        let reader = new FileReader();
        let file = droppedFiles[0];

        reader.onloadend = () => {
          this.setState({
            [dynamicKey]: reader.result
          }, this.updateDropzone);
        }

        reader.readAsDataURL(file);
        // ------------------------------------


        var newFiles = this.state.files;
        newFiles[i] = droppedFiles[0];
        this.setState({
          files: newFiles
   	 });

    }

    clearImage(i) {
        var newFiles = new Array(3);
        var index;
        for (index = 0; index < 3; index++) {
            if (index != i) {
                if(typeof(this.state.files[i]) != "undefined") {
                    newFiles[index] = this.state.files[index];
                }
            }
        }
        this.setState({files : newFiles});
    }
    create() {
        this.setState({imageUrls: ['unhandled', 'unhandled', 'unhandled']});
        this.handleImage(0);
    }
    handleImage(i) {
        if (i == 3) {
            this.postToDatabase();
            return;
        }
        if (typeof(this.state.files[i]) == "undefined") {
           // alert("underfined");
            var newUrls = this.state.imageUrls;
            newUrls[i] = "empty";
            this.setState({imageUrls : newUrls}, () => {
                    this.handleImage(i+1);
            });
            return;
        }
        var file = this.state.files[i];

        var imageData = {
            fileName: file.name,
            fileType: file.type,
        }
        fetch(process.env.REACT_APP_SERVER + '/uploadListing', {
         credentials : 'include',
         headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
             'Access-Control-Allow-Headers': 'Content-Type'
         },
         method: 'POST',
         body: JSON.stringify(imageData)

       }).then((res) => res.text().then(response => {
         this.putPicture(response, file, i);
       }))
       .catch((err)=>{
         alert(err);
       });
    }
    putPicture(url, file, i) {
    fetch(url, {
                headers: {
                        'Access-Control-Allow-Origin' : '*',
            'Content-Type' : file.type,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Origin': process.env.REACT_APP_DOMAIN
                },
                body: file,
                method: "PUT"
        }).then((response) => response.text())
    .then((responseJson) => {
        var locationUrl = 'https://s3.us-east-2.amazonaws.com/list-image/' + file.name;
        var newUrls = this.state.imageUrls;
        newUrls[i] = locationUrl;
        this.setState({imageUrls : newUrls}, () => {
            this.handleImage(i+1);
        })
    })
    .catch((err)=>{
            alert(err);
        });
    }

    postToDatabase(){
        alert(this.state.imageUrls);
      if (this.state.imageUrls[0] == 'empty' || this.state.imageUrls[1] == 'empty' || this.state.imageUrls[2] == 'empty') {
        alert("3 images are required");
        return;
      }
      if (this.state.imageUrls[0] == 'unhandled' || this.state.imageUrls[1] == 'unhandled' || this.state.imageUrls[2] == 'unhandled') {
        //alert('not done yet');
         return;
      }
      //alert('posting');
      var data = {
        location: this.state.location,
        color: this.state.color,
        condition: this.state.condition,
        shippingPrice: this.state.shippingPrice,
        description: this.state.description,
        name: this.state.name,
        brand: this.state.brand,
        type: this.state.type,
        size: this.state.size,
        price: this.state.price,
        image1: this.state.imageUrls[0],
        image2: this.state.imageUrls[1],
        image3: this.state.imageUrls[2]
      };
      fetch(process.env.REACT_APP_SERVER + '/createListing', {
          credentials : 'include',
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
              'Access-Control-Allow-Headers': 'Content-Type'
          },
          method: 'POST',
          body: JSON.stringify(data)
      }).then((res) => res.json().then(response => {
        if (response.success == 'true') {
          this.props.history.push("/")
	  alert("listing created");
	}
	else {
	  this.handleOpenModal();
	}
      }))
      .catch((err)=> alert(err));

    }
    handleValidity(option, value) {
        if (!this.state.dataLists[option].includes(value)) {
            var data = {};
            data[option] = '';
            data['size'] = '';
            data['currentSizeList'] = sizeLists['None'];
            this.setState(data);

        }
        else {
            if(option == 'type'){
                this.setState({currentSizeList: sizeLists[value],
                                size: ''
                            });
            }
        }

    }


    render() {
        return (
          <div id="CreateListing">
            <div id="CreateListingContainer">

               <h2 className="CreateListingTitle">Create your listing</h2>

                <div>
                    <div id="CreateListingDiv">

                    <div id="PieceNameDiv">
                        <label for="myPieceName">Piece Name</label>
                        <input
                            id="PieceNameInput"
                            className="form-control"
                            type="text"
                            placeholder="Piece name"
                            onChange={event => this.setState({name: event.target.value})}
                        />
                    </div>


                    <div id="BrandDiv">

                        <label for="myBrand">Brand/Designer</label>
                        <input
                          value={this.state.brand}
                          list="Brand"
                          placeholder="Brand"
                          type = "text"
                          required pattern="[a-zA-Z]*"
                          id="BrandInput"
                          className ="form-control"
                          onBlur={event => this.handleValidity('brand', event.target.value)}
                          onChange={event => this.setState({brand: event.target.value})}
                          />

                        <datalist id="Brand" type ="text" required pattern="[a-zA-Z]*">
                        <option value="" selected disabled hidden>Brand</option>
                        {this.state.dataLists.brand.map((brand, index) =>
                            <option>{brand}</option>
                        )}
                        </datalist>

                    </div>

                    <div id="SizeDiv">
                        <label for="mySize">Size</label>
                        <select value={this.state.size} onChange={event => this.setState({size: event.target.value})} id="SizeSelect" className="form-control">
                            <option value="" selected disabled hidden>Size</option>
                            {this.state.currentSizeList.map((size, index) =>
                                <option value={size}>{size}</option>
                            )}
                        </select>
                     </div>

                        <br />
                    <div id="DescriptionDiv">
                        <label>Description of product</label>
                        <textarea
                            id="DescriptionTextArea"
                            className="form-control"
                            type="text"
                            placeholder="Description"
                            onChange={event => this.setState({description: event.target.value})}
                        />
                    </div>
                        <br />

                        <div id="PriceDiv">
                          <label>Price</label>
                          <input
                            id="PriceInput"
                            className="form-control"
                            type="number"
                            placeholder="price"
                            onChange={event => this.setState({price: event.target.value})}
                          />
                        </div>


                        <div id="TypeDiv">
                          <label for="myType">Type</label>
                          <input
                            value={this.state.type}
                            list="Type"
                            name="myType"
                            type="text"
                            required pattern="[a-zA-Z]*"
                            placeholder="Cloth Type"
                            id="TypeInput"
                            className ="form-control"
                            onBlur={event => this.handleValidity('type', event.target.value)}
                            onChange={event =>
                                    this.setState({type: event.target.value})
                             }
                            />
                          <datalist id="Type" type ="text" required pattern="[a-zA-Z]*">
                          <option value="" selected disabled hidden>Color</option>
                          {this.state.dataLists.type.map((type, index) =>
                            <option>{type}</option>
                          )}
                          </datalist>
                        </div>

                    <div id="ConditionDiv">
                        <label for="myCondition">Condition (Out of 10)</label>
                        <select value={this.state.condition} onChange={event => this.setState({condition: event.target.value})} id="ConditionSelect" className="form-control">
                            <option value="" selected disabled hidden>Condition </option>
                            {this.state.dataLists.condition.map((condition, index) =>
                            <option value={condition}>{condition}</option>
                            )}
                        </select>
                    </div>


                <div id="ColorDiv">
                    <label for="myColor">Color (Primary)</label>
                    <input
                      value={this.state.color}
                      list="Color"
                      name="myColor"
                      type = "text"
                      required pattern="[a-zA-Z]*"
                      placeholder="Color"
                      className ="form-control Color"
                      onBlur={event => this.handleValidity('color', event.target.value)}
                      onChange={event => this.setState({color: event.target.value})}
                      />
                    <datalist id="Color" type ="text" required pattern="[a-zA-Z]*">
                    <option value="" selected disabled hidden>Color</option>
                    {this.state.dataLists.color.map((color, index) =>
                            <option>{color}</option>
                        )}
                    </datalist>
                </div>
                    <br />

                     <label for="myLocation">Location</label>
                    <input
                      value={this.state.location}
                      list="Location"
                      placeholder="Location"
                      type ="text"
                      className ="form-control Location"
                      onBlur={event => this.handleValidity('location', event.target.value)}
                      onChange={event => this.setState({location: event.target.value})}
                      />
                    <datalist id="Location" type ="text">
                    <option value="" selected disabled hidden>Location</option>
                    {this.state.dataLists.location.map((location, index) =>
                            <option>{location}</option>
                        )}
                    </datalist>

                    <br />


            <div className="ImageUploadSortable">
                <DragSortableList items={this.state.list} type="horizontal"/>
            </div>

            <br />
            <div className="CreateButtonDiv">
                <button
                    className="CreateButton"
                    type="button"
                    onClick={() => this.create()}
                > Create </button>
            </div>
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
          </div>
        );
    }

}

export default CreateListing;
