import React, { Component } from 'react';
// import { Link, browserHistory } from 'react-router';

// import { Grid, Cell, IconButton } from 'react-mdl';
import Loader from '../Components/Loader';
// import GettingStartedExample from '../Components/Map';
import Map from '../Components/Map';

class Events extends React.Component {
    constructor(props) {
        super(props);

        this.state = { loading: true };

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
    }

    componentDidMount() {
        const { controller } = this.props.route;


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);


                controller.getEventsNearMe(position)
                    .then((data) => {
                        console.log('event data', data.length);
                        this.setState({
                            events: data,
                            loading: false
                        });
                    });
            });
        } else {
            this.setState({ loading: false, error: 'Geolocation not supported by this browser.' });
        }
    }

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            console.log(map.getZoom());
        }
    }

    handleMapClick(event) {
        const nextMarkers = [
            ...this.state.markers,
            {
                position: event.latLng,
                defaultAnimation: 2,
                key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
            },
        ];
        this.setState({
            markers: nextMarkers,
        });

        if (nextMarkers.length === 3) {
            this.props.toast(
                `Right click on the marker to remove it`,
                `Also check the code!`
            );
        }
    }

    render() {
        return (
            <div style={{ height: '100vh' }}>
                    <Map markers={this.state.events ? this.state.events : []} />

                <Loader active={this.state.loading} />
            </div>
        );
    }
}

export default Events;