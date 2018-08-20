import React from 'react';
import './styles/Loading.css';
import LoginPage from '../login/LoginPage';
import { ClimbingBoxLoader } from 'react-spinners';


class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading
    }
  }
  render() {
    return (
    <div className="LoadingStyle">
        <ClimbingBoxLoader
          color={'#123abc'}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

export default Loading;
