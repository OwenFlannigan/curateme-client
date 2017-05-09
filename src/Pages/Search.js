import React, { Component } from 'react';

import { Layout, Navigation, Drawer, Header, Textfield, Card, CardTitle, CardActions, Grid, Cell, IconButton, Menu, MenuItem, Snackbar } from 'react-mdl';
import { browserHistory, Link } from 'react-router';
import SongList from '../Components/SongList';
import AddTrackDialog from '../Components/AddTrackDialog';
import Loader from '../Components/Loader';
import _ from 'lodash';




class Search extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: true, isSnackbarActive: false };
        this.search();
    }

    componentDidMount() {
        const { auth } = this.props;

        if (auth.loggedIn) {
            this.loadUserPlaylists();
        }
    }

    loadUserPlaylists() {
        const { auth } = this.props;

        auth.fetch('/api/me/playlists')
            .then((data) => {
                var playlistData = Object.keys(data).map((key) => {
                    return {
                        name: data[key].name,
                        key: key
                    };
                });
                this.setState({ playlists: playlistData, loading: false });
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location != this.props.location) {
            console.log('yup yup');
            this.setState({ loading: true });
            this.search();
        }
    }

    search() {
        var q = window.location.search.split('=')[1];
        if (q) {
            const { controller } = this.props.route;

            controller.search(q)
                .then((data) => {
                    console.log('search data', data);
                    this.setState({
                        loading: false,
                        results: data
                    });
                });
        } else {
            browserHistory.push('/');
        }
    }

    loadVideo(track) {
        const { audio } = this.props;
        const { controller } = this.props.route;

        this.setState({ loading: true });
        var query = track.name + ' ' + track.artists[0].name;

        controller.videoSearch(query)
            .then((data) => {
                audio.setData(data);
                this.setState({ loading: false });
            });
    }



    handleMenuAction(data) {
        if (data.action == 'Add to Playlist') {
            this.setState({ isDialogActive: true, trackId: data.track.id });
        }
    }

    handleAddTrack(key) {
        this.setState({ loading: true });
        const { controller } = this.props.route;

        controller.addTrackToPlaylist(key, [this.state.trackId])
            .then((data) => {
                if (data.message) {
                    this.setState({ loading: false, isDialogActive: false, isSnackbarActive: true, snackbarText: 'Track(s) has been added to playlist.' });
                } else if (data.error) {
                    this.setState({ isSnackbarActive: true, snackbarText: 'Please select a playlist.', loading: false });
                }
            });
    }

    render() {
        if (this.state.results) {
            var artists = this.state.results.artists.items.map((artist, index) => {
                var albums = _.filter(this.state.results.albums.items, (o) => {
                    return o.artists[0].id == artist.id;
                });

                return (
                    <ArtistPresentation
                        artist={artist}
                        albums={albums}
                        key={artist.id + index} />
                );
            });
        }

        // var options = [''];
        // if (this.state.playlists) {
        //     options = _.map(this.state.playlists, 'name');
        // }

        return (
            <div className="myContainer">
                <AddTrackDialog
                    active={this.state.isDialogActive}
                    options={this.state.playlists ? this.state.playlists : []}
                    onClose={() => { this.setState({ isDialogActive: false }) }}
                    onAction={(key) => { this.handleAddTrack(key) }} />

                <Snackbar
                    active={this.state.isSnackbarActive}
                    onClick={() => { this.setState({ isSnackbarActive: false }) }}
                    onTimeout={() => { this.setState({ isSnackbarActive: false }) }}
                    action="close">{this.state.snackbarText}</Snackbar>


                {(this.state.results && artists.length > 0) && <div>
                    <h1>Artists <Link to={'/search/artists?q=' + window.location.search.split('=')[1]}><span className="sub-header">see more</span></Link></h1>

                    {artists[0]}
                </div>}

                <h1>Tracks</h1>
                {
                    this.state.results &&
                    <SongList
                        tracks={this.state.results.tracks.items}
                        menuItems={
                            [this.state.playlists ? 'Add to Playlist' : null, 'Show Similar Songs']
                        }
                        onMenuItemClick={(d) => { this.handleMenuAction(d) }}
                        onPlayTrack={(track) => { this.loadVideo(track) }} />
                }

                <Loader active={this.state.loading} />
            </div >
        );
    }
}

class ArtistPresentation extends React.Component {
    render() {
        var imageUrl = this.props.artist.images[0] ? this.props.artist.images[0].url : '';

        var limit = Math.min(this.props.albums.length, 4);
        var albums = this.props.albums.slice(0, limit).map((album) => {
            return (
                <Cell col={6} style={{ margin: 'auto' }} key={album.id}>
                    <Link to={'/album/' + album.id}>
                        <img
                            className="artist-pres-album responsive-img"
                            src={album.images[0].url}
                            alt={album.name + ' cover art'} />
                    </Link>
                </Cell>
            );
        });

        return (
            <Grid>
                <Cell col={4} tablet={2} hidePhone>
                    <Grid style={{ height: '100%' }}>
                        {albums.slice(0, 2)}
                    </Grid>
                </Cell>

                <Cell col={4}>
                    <Link to={'/artists/' + this.props.artist.id}>
                        <Card
                            className="artist-pres-card"
                            shadow={0}
                            style={{ width: '100%', height: '256px', background: 'url(' + imageUrl + ') center / cover', margin: 'auto' }}>

                            <CardTitle expand />
                            <CardActions style={{ height: '52px', padding: '16px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                                <span className="artist-pres-name">{this.props.artist.name}</span>
                            </CardActions>
                        </Card>
                    </Link>
                </Cell>

                <Cell col={4} tablet={2} hidePhone>
                    <Grid style={{ height: '100%' }}>
                        {albums.slice(2, 4)}
                    </Grid>
                </Cell>
            </Grid>
        );
    }
}

export default Search;
