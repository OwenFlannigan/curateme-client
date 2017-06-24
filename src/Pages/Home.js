import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import YouTube from 'react-youtube';

import { Grid, Cell, IconButton } from 'react-mdl';
import SongList from '../Components/SongList';
import PlaylistList from '../Components/PlaylistList';
import ActivityBoard from '../Components/ActivityBoard';
import TracksPresentation, { TracksPresentationScroll } from '../Components/TracksPresentation';
import FriendFeed from '../Components/FriendFeed'
import Loader from '../Components/Loader';
import ScrollableContent from '../Components/ScrollableContent';

import _ from 'lodash';
import Vibrant from 'node-vibrant';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: props.auth.getProfile(),
            cardWidth: '50%',
            loading: true,
            bgColor: '#1d1d1d'
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
                    recommendedTracks: _.concat(this.state.recommendedTracks, data),
                    loading: false,
                    panel: 0
                });
            });
    }

    loadVideo(track, hasNext) {
        console.log('loading track', track);
        const { audio, audioPlaylist } = this.props;
        const { controller } = this.props.route;

        this.setState({ loading: true });
        var query = track.name + ' ' + track.artists[0].name;

        controller.videoSearch(query)
            .then((data) => {
                console.log('video search', query, data);

                // if(hasNext) {
                var currentTrackIndex = _.findIndex(this.state.recommendedTracks, (recommendedTrack) => {
                    return recommendedTrack.id == track.id;
                });
                audioPlaylist.setPlaylist(this.state.recommendedTracks.slice(currentTrackIndex + 1, this.state.recommendedTracks.length));
                // }

                audio.setData(data);
                this.setState({ loading: false });
            });

        let v = new Vibrant(track.album.images[0].url);
        v.getPalette().then((palette) => {
            var rgb = palette.Vibrant.getRgb();
            var color = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
            console.log('color', color);
            this.setState({ bgColor: color });
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
            <div>
                <Loader active={this.state.loading} />

                <Grid className="home-content" noSpacing>

                    <Cell col={12} hidePhone className="track-pres-scroll-container"
                        style={{ backgroundColor: this.state.bgColor }}>
                        {/*<h1>Recommendations<IconButton name="refresh" onClick={() => this.refreshRecommendations()} /></h1>*/}
                        <ScrollableContent
                            onLoadMore={() => { this.refreshRecommendations() }}>

                            {this.state.recommendedTracks &&
                                <TracksPresentationScroll
                                    tracks={this.state.recommendedTracks}
                                    onPlayTrack={(track, hasNext) => { this.loadVideo(track, hasNext) }} />}

                        </ScrollableContent>
                    </Cell>

                    <Cell col={12} hideDesktop hideTablet
                        className="myContainer">
                        <h1>Recommendations<IconButton name="refresh" onClick={() => this.refreshRecommendations()} /></h1>
                        {this.state.recommendedTracks &&
                            <TracksPresentation
                                tracks={this.state.recommendedTracks}
                                onPlayTrack={(track, hasNext) => { this.loadVideo(track, hasNext) }} />}

                    </Cell>


                    {/*<Cell col={12}>
                        {this.state.recentActivity &&
                            <FriendFeed data={this.state.recentActivity} />}
                    </Cell>*/}
                    {
                        (this.state.recentActivity && _.values(this.state.recentActivity).length > 0) &&
                        <Cell col={12} className="myContainer">
                            <h1>Friend Activity</h1>
                            <ActivityBoard data={this.state.recentActivity} />
                        </Cell>
                    }




                    {/*</Grid>*/}
                    {/*<Grid>*/}
                    <Cell col={12} className="myContainer">
                        <h1>Playlists you might like{/*<IconButton name="refresh" />*/}</h1>
                        {this.state.topPlaylists &&
                            <PlaylistList
                                playlists={this.state.topPlaylists}
                                username={this.state.username}
                                onFavorite={(key) => { this.handleFavorite(key) }} />}

                    </Cell>
                </Grid >
            </div >
        );
    }
}

export default Home;