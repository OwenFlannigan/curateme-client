import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { Grid, Cell, Chip, IconButton, Textfield, Icon } from 'react-mdl';
import IconTextfield from './IconTextfield';
import Dialog from './Dialog';
import FavoriteButton from './FavoriteButton';
import SongList from './SongList';

import moment from 'moment';



class DetailedPlaylistView extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isDialogActive: false };
    }

    handleChange(event) {
        console.log(event.target.value);
    }

    render() {
        /*if (this.state.isDialogActive) {
            var modal = <Dialog onClose={() => { this.setState({ isDialogActive: false }) }}>
                <h1>Share this playlist?</h1>
                <p>Who do you want to send this playlist to?</p>
                <IconTextfield
                    icon="search"
                    onChange={(e) => this.handleChange(e)} />
            </Dialog>;
        }*/

        var images = <Cell col={12}>
            <div className="responsive-div-img" style={{ backgroundImage: 'url(' + this.props.playlist.image + ')' }}></div>
        </Cell>;

        if (this.props.playlist.tracks) {
            images = this.props.playlist.tracks.slice(0, 4).map((track, index) => {
                if (track.album) {
                    return (
                        <Cell col={6} tablet={4} key={track.album.images[0].url + index}>
                            <img className="responsive-img" src={track.album.images[0].url} />
                        </Cell>
                    );
                }
            });
        }

        if (this.props.playlist.mood) {
            var moods = this.props.playlist.mood.split(',').map((mood, index) => {
                return <Chip style={{ marginRight: '0.5rem' }} key={mood + index}>{mood}</Chip>;
            });
        }


        return (
            <Grid noSpacing>
                <Cell col={12}>
                    <Grid noSpacing>
                        <Cell col={9} tablet={4} phone={12} style={{ position: 'relative', minHeight: '230px' }}>
                            <h1 style={{ paddingLeft: '0' }}>{this.props.playlist.name} <span className="sub-header">for {this.props.playlist.best_used_for}</span></h1>

                            <h2>{this.props.playlist.tracks ? this.props.playlist.tracks.length : '0'} tracks by <Link to={'/users/' + this.props.playlist.creator_key}>{this.props.playlist.creator_name}</Link>
                                {this.props.playlist.suggested_tracks ? ', ' : ''}
                                <span className="suggested-track">{this.props.playlist.suggested_tracks ? Object.keys(this.props.playlist.suggested_tracks).length + ' suggested tracks' : ''}</span>
                            </h2>


                            <div className="detailed-playlist-actions">
                                <div>{moods}</div>
                                {!this.props.editable && <button>Suggest a track</button>}
                                <button onClick={this.props.onShare}>Share</button>
                                {this.props.editable && <button onClick={this.props.onEdit}>Edit</button>}
                                <FavoriteButton 
                                    onClick={() => { this.props.onFavorite() }} 
                                    count={this.props.favoritesCount} 
                                    playlist_key={this.props.playlist_key}
                                    favorited={this.props.favorited} />
                            </div>
                        </Cell>
                        <Cell col={3} tablet={3} offsetTablet={1} hidePhone>
                            <Grid noSpacing>
                                {images}
                            </Grid>
                        </Cell>
                    </Grid>
                </Cell>

                {!this.props.playlist.tracks &&
                    <p className="add-playlist-message">Try adding some tracks and sharing what you make with others!</p>}

                {this.props.playlist.tracks &&
                    <Cell col={12} className="detailed-plv-song-list">
                        <SongList
                            tracks={this.props.playlist.tracks}
                            onPlayTrack={(track) => { this.props.onPlayTrack(track) }}
                            menuItems={['Remove track', 'Show Similar Songs']}
                            onMenuItemClick={(d) => { this.props.onMenuItemClick(d) }} />

                        {this.props.playlist.suggested_tracks &&
                            <SongList
                                tracks={this.props.playlist.suggested_tracks}
                                listItemClassName="suggested-track"
                                menuItems={['Show Similar Songs']}
                                onMenuItemClick={(d) => { this.props.onMenuItemClick(d) }}
                                onPlayTrack={(track) => { this.props.onPlayTrack(track) }} />}
                    </Cell>}

            </Grid>
        );
    }
}

export default DetailedPlaylistView;