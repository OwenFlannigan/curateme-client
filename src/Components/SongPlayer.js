import React, { Component } from 'react';
// import { IndexLink, browserHistory, Link } from 'react-router';

import { Grid, Cell, IconButton, ProgressBar } from 'react-mdl';
import YouTube from 'react-youtube';
import _ from 'lodash';

class SongPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { trackId: this.props.data.id };
        console.log('player data', this.props.data);
    }
    
    componentDidMount() {
        this.setState({ trackId: this.props.data.id });        
    }

    componentWillUpdate(nextProps) {
        if(this.props.data.id != nextProps.data.id) {
            this.setState({ trackId: nextProps.data.id });
        }
    }

    togglePlayer() {
        if (this.state.bottom == '-7rem') {
            this.setState({ bottom: '0rem' });
            this.props.updateParent({ isPlayerActive: true });
        } else {
            this.setState({ bottom: '-7rem' });
            this.props.updateParent({ isPlayerActive: false });
        }

    }

    render() {
        console.log('sp props', this.props);
        const options = {
            playerVars: { // https://developers.google.com/youtube/player_parameters 
                autoplay: 1,
                playlist: this.props.playlist ? this.props.playlist.join(',') : ''
            }
        };

        console.log('video opts', options);

        var iconName = 'keyboard_arrow_down';
        if (this.state.bottom == '-7rem') {
            iconName = 'keyboard_arrow_up';
        }

        return (
            <div className="song-player" style={{ bottom: this.state.bottom }}>
                <div className="song-player-close">
                    <IconButton
                        name={iconName}
                        onClick={() => { this.togglePlayer() }} />
                </div>

                <Grid noSpacing>
                    <Cell col={2} tablet={2} phone={1}>
                        <YouTube
                            videoId={this.state.trackId}
                            className="responsive-video player-video"
                            opts={options} />

                    </Cell>

                    <Cell col={9} tablet={5} phone={2} className="information">
                        <h1>{this.props.data.title}</h1>
                        <p>uploaded by <a href={'https://www.youtube.com/watch?v=' + this.props.data.id}>{this.props.data.channelTitle}</a></p>
                    </Cell>

                    <Cell col={1} tablet={1} phone={1} className="information" style={{ textAlign: 'right' }}>
                        <IconButton name="add" />
                        <IconButton name="share" />
                    </Cell>
                </Grid>
            </div>
        );
    }
}

export default SongPlayer;