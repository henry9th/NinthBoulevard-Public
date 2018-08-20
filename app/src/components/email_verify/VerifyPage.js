import React from 'react';
import qs from 'query-string';

class VerifyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            error: ""
        };
        var id = qs.parse(this.props.location.search).id;
        var email = qs.parse(this.props.location.search).email;
        this.verify(id, email);
    }
    verify(id, email) {
        var query = '?id=' + id + '&email=' + email;
        fetch(process.env.REACT_APP_SERVER + '/verify' + query, {
            credentials : 'include',
            headers: {
                'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            },
            method: 'GET'
        }).then((res) => res.json().then(response => {
            alert(JSON.stringify(response));
            if (response.success == 'true') {
                this.setState({status: 'successfully verified'});
            }
            else {
                this.setState({
                    error: response.data.reason,
                    status: 'error verfiying'    
                });
            }
        }))
        .catch((err)=> {
            alert(err);
        });
    }


    render() {
    
        return (
            <div className='VerifyPage'>
                {this.state.status}
                <br></br>
                {this.state.error}

            </div>

        );
    }

}

export default VerifyPage;
