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
                            onClick={() => { this.props.onPlayTrack(track) }} />
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

export default TracksPresentation;