import React, { Component}  from 'react';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: ''
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file);
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} height="150" width="150"/>);
    } else {
        $imagePreview = (<img src= {"https://picsum.photos/200/300"} height="150" width="150" />);
    }

    return (
      <div>
        {$imagePreview}
        <form onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
        </form>
      </div>
    )
  }

}

export default ImageUpload;
