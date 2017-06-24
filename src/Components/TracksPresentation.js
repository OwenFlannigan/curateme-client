import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { Grid, Cell, Tooltip } from 'react-mdl';


class TracksPresentation extends React.Component {
    render() {
        var tracks = this.props.tracks.map((track, index) => {
            var tooltopPosition = 'top';
            if (index >= 6) {
                tooltopPosition = 'bottom';
            }

            return (
                <Cell col={2} key={track.id + '-album-pres-cover'} style={{ cursor: 'pointer' }}>
                    <Tooltip label={track.name} position={tooltopPosition} large>
                        <img
                            src={track.album.images[0].url}
                            className="responsive-img"
                            alt={track.id}
                            onClick={() => { this.props.onPlayTrack(track, index) }} />
                    </Tooltip>
                </Cell>
            );
        });
        return (
            <Grid noSpacing>
                {tracks.slice(0, 12)}
            </Grid>
        );
    }
}

class TracksPresentationScroll extends React.Component {
    render() {
        // console.log('props', this.props);
        var tracks = this.props.tracks.map((track, index) => {
            var tooltopPosition = 'top';
            if (index >= 6) {
                tooltopPosition = 'bottom';
            }

            return (
                <div
                    key={track.id + '-album-pres-cover'}
                    className="track-pres-item"
                    style={{ width: this.props.width ? (this.props.width / 4) : '200px' }}>
                    <img
                        src={track.album.images[0].url}
                        className="responsive-img"
                        alt={track.id}
                        onClick={() => { this.props.onPlayTrack(track) }} />

                    <div className="track-pres-item-details">
                        <h2>{track.name}</h2>
                        <p>{track.artists[0].name}</p>
                    </div>
                </div>
            );
        });
        return (
            <div className="track-pres-scroll">
                {tracks}
            </div>
        );
    }
}

export { TracksPresentationScroll };
export default TracksPresentation;