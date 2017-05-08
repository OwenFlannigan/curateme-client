import React, { Component } from 'react';
import { GoogleMap, GoogleMapLoader, Marker, InfoWindow } from 'react-google-maps/lib';

import _ from 'lodash';
import moment from 'moment';

class Map extends Component {

    state = {
        markers: [{
            position: {
                lat: 25.0112183,
                lng: 121.52067570000001,
            },
            key: `Taiwan`,
            defaultAnimation: 2,
        }],
    };

    handleMapLoad = this.handleMapLoad.bind(this);
    handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            console.log(map.getZoom());
        }
    }

    /*
     * This is called when you click on the map.
     * Go and try click now.
     */

    handleMarkerRightClick(targetMarker) {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        this.setState({
            markers: nextMarkers,
        });
    }

    render() {
        var markers = this.props.markers.map((marker, index) => {
            var LatLng = {
                lat: parseFloat(marker.latitude),
                lng: parseFloat(marker.longitude)
            }

            var content = marker.title + ' - ' + marker.venue_name + ' @ ' + moment(marker.start_time).format('h:mm a');
            

            return <Marker
                key={'marker-' + index}
                position={LatLng}
                defaultAnimation={2}
                title={marker.title}
                onClick={() => { this.setState({ activeInfoWindow: index }) }} >

                {(this.state.activeInfoWindow == index) && <InfoWindow
                    content={content}
                    position={LatLng}
                    onCloseClick={_.noop}
                    onDomReady={_.noop}
                    onZIndexChanged={_.noop}
                />}

            </Marker>
        });

        /*var infoWindows = this.props.markers.map((marker, index) => {
            var LatLng = {
                lat: parseFloat(marker.latitude),
                lng: parseFloat(marker.longitude)
            }

            var window = <InfoWindow
                content={marker.title}
                position={LatLng}
                onCloseClick={_.noop}
                onDomReady={_.noop}
                onZIndexChanged={_.noop}
            />;

            if (this.state.activeInfoWindow == LatLng) {
                return window;
            }
        });*/

        console.log(markers);
        return (
            <GoogleMapLoader
                containerElement={
                    <div
                        ref={(mapHolder) => { this.mapHolderRef = mapHolder }}
                        style={{
                            height: "100%",
                        }}
                    />
                }
                googleMapElement={
                    <GoogleMap
                        ref={(map) => { console.log(map) }}
                        defaultZoom={12}
                        defaultCenter={{ lat: 47.6062, lng: -122.3321 }}>

                        {markers}



                    </GoogleMap>
                }
            />
        );
    }
}

export default Map;