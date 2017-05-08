import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import YouTube from 'react-youtube';

import { Grid, Cell, IconButton } from 'react-mdl';
import SongList from '../Components/SongList';
import PlaylistList from '../Components/PlaylistList';
import ActivityBoard from '../Components/ActivityBoard';
import TracksPresentation from '../Components/TracksPresentation';
import FriendFeed from '../Components/FriendFeed'
import Loader from '../Components/Loader';

import _ from 'lodash';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: props.auth.getProfile(),
            cardWidth: '50%',
            loading: true
        }

        props.auth.on('profile_updated', (newProfile) => {
            this.setState({ profile: newProfile });
        });

        this.callApis();
    }

    callApis() {
        const { auth, audio } = this.props;
        // const { spotify } = this.props.route;
        const { controller } = this.props.route;

        console.log('home audio', audio);
        this.loadTopPlaylists();

        controller.getMyRecommendedTracks()
            .then((data) => {
                if (data.message) {
                    controller.refreshMyRecommendedTracks()
                        .then((data) => {
                            this.setState({
                                recommendedTracks: data,
                                loading: false
                            });
                        });
                } else {
                    this.setState({
                        recommendedTracks: data.tracks,
                        loading: false
                    });
                }
            });

        controller.getFriendActivity()
            .then((data) => {
                this.setState({
                    recentActivity: data
                });
            });

        controller.getMyProfile()
            .then((data) => {
                this.setState({
                    username: data.username
                });
            });



        // auth.fetch('/api/me/profile')
        //     .then((data) => {
        //         console.log(data);
        //     });

        // auth.fetch('/api/me/playlists')
        //     .then((data) => {
        //         console.log(data);
        //         this.setState({
        //             playlist: data[0]
        //             // tracks: data[0].tracks
        //         });
        //     });

        // spotify.getPlaylistTracks('6S4zoQUQdVMZSEseoCgudB');
    }

    loadTopPlaylists() {
        const { controller } = this.props.route;

        controller.getTopPlaylists()
            .then((data) => {
                console.log('call to get top playlists', data);
                this.setState({
                    topPlaylists: data
                });
            });
    }

    refreshRecommendations() {
        this.setState({ loading: true });
        const { controller } = this.props.route;

        controller.refreshMyRecommendedTracks()
            .then((data) => {
                this.setState({
                    recommendedTracks: data,
                    loading: false
                });
            });
    }

    loadVideo(track) {
        console.log('loading track', track);
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

    toggleCardWidth() {
        if (this.state.cardWidth == '50%') {
            this.setState({ cardWidth: '100%' });
        } else {
            this.setState({ cardWidth: '50%' });
        }
    }

    handleFavorite(playlistKey) {
        const { controller } = this.props.route;

        controller.favoritePlaylist(playlistKey)
            .then((data) => {
                this.loadTopPlaylists();
            });
    }

    render() {

        return (
            <div className="myContainer">
                <Loader active={this.state.loading} />

                <Grid className="home-content">
                    {/*<Cell col={12}>
                        {this.state.recentActivity &&
                            <FriendFeed data={this.state.recentActivity} />}
                    </Cell>*/}
                    {(this.state.recentActivity && _.values(this.state.recentActivity).length > 0) && <Cell col={12}>
                        <h1>Friend Activity</h1>
                        <ActivityBoard data={this.state.recentActivity} />
                    </Cell>}


                    <Cell col={12}>
                        <h1>Recommendations<IconButton name="refresh" onClick={() => this.refreshRecommendations()} /></h1>
                        {this.state.recommendedTracks &&
                            <div style={{ padding: '8px' }}>
                                <TracksPresentation
                                    tracks={this.state.recommendedTracks}
                                    onPlayTrack={(track) => { this.loadVideo(track) }} />
                            </div>}
                    </Cell>

                    {/*</Grid>*/}
                    {/*<Grid>*/}
                    <Cell col={12}>
                        <h1>Playlists you might like{/*<IconButton name="refresh" />*/}</h1>
                        {this.state.topPlaylists &&
                            <PlaylistList
                                playlists={this.state.topPlaylists}
                                username={this.state.username}
                                onFavorite={(key) => { this.handleFavorite(key) }} />}

                    </Cell>
                </Grid>
            </div>
        );
    }
}

export default Home;