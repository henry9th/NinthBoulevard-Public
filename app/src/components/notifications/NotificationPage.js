import React from 'react';

class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
        this.getNotifications();
    }
    getNotifications() {
        fetch(process.env.REACT_APP_SERVER + '/getNotifications', {
            credentials : 'include',
            headers: {
                'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER,
            },
            method: 'GET'
        }).then((res) => res.json().then(response => {
            if (response.success) {
                this.setState({notifications: response.data.notifications});
            }
            else {
            }
        }))
        .catch((err)=> {
            alert(err);
});
    }
    render() {
        return ( 
            <div>   
            <h1> Notifications </h1>

            <div className='notifications'>
                {this.state.notifications.map((notification, index) =>
                    <div>
                        {notification}
                    </div>
                )}
            </div>
            </div>
        )
    }
}

export default NotificationPage;
