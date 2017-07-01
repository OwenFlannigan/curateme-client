import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { Snackbar } from 'react-mdl';
import { FormControl } from 'react-bootstrap';

import SongList from '../Components/SongList';
import PlaylistList from '../Components/PlaylistList';
import DetailedPlaylistView from '../Components/DetailedPlaylistView';
import Loader from '../Components/Loader';
import { EditPlaylistDialog } from '../Components/Dialog';
import ShareDialog from '../Components/ShareDialog';

import _ from 'lodash';


class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: props.auth.getProfile(),
            loading: true,
            isSnackbarActive: false
        }
        console.log('when setting state', props.auth.getProfile());

        this.callApis(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.playlist_key != this.props.params.playlist_key) {
            this.setState({
                recommendedPlaylists: '',
                playlist: '',
                loading: true
            });
            this.callApis(nextProps);
        }
    }

    callApis(props) {
        // Check for key is not needed, handled in index.js
        const { auth } = props;
        const { controller, spotify } = props.route;

        // required structure for dealing with stored and async data. Probs a cleaner way to do this in DataController.
        var playlist = controller.getPublicPlaylist(props.params.playlist_key);
        if (playlist.then) {
            playlist.then((data) => {
                if (data.message) {
                    browserHistory.replace('/playlist_not_found');
                } else {
                    // data.tracks = _.sortBy(data, ['added_at']);
                    console.log('getting playlist data here', data);

                    this.getRecommendedPlaylists(data);
                    this.setState({
                        mood: data.mood,
                        playlist: data,
                        count: data.favorites ? (Object.keys(data.favorites)).length : 0
                    });
                }
            });
        } else {
            this.getRecommendedPlaylists(playlist);
            this.setState({
                playlist: playlist,
                count: playlist.favorites ? (Object.keys(playlist.favorites)).length : 0
            });
        }

        // controller.getMyProfile()
        //     .then((data) => {
        //         this.setState({ userKey: data.key });
        //     });

        controller.getUsers()
            .then((data) => {
                var users = _.map(data, (user) => {
                    return user.username;
                });
                this.setState({ users: users });
            });
    }

    getRecommendedPlaylists(playlist) {
        const { controller } = this.props.route;

        if (playlist.recommended_playlists) {
            var playlist_keys = _.values(playlist.recommended_playlists);
            console.log('rec playlist keys', playlist_keys);

            controller.getMultiplePublicPlaylists(playlist_keys.join(','))
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (!data.message) {
                        this.setState({ recommendedPlaylists: data, loading: false });
                    } else {
                        console.log(data.message);
                        this.setState({ loading: false });
                    }
                });
        } else {
            this.setState({ loading: false });
        }

    }

    handleFavorite() {
        // this.setState({ loading: true });
        const { controller } = this.props.route;

        // now actually update the playlist. uncomment code inside to swap
        controller.favoritePlaylist(this.props.params.playlist_key)
            .then((data) => {
                // var playlist = this.state.playlist;
                // playlist.favorites = data.favorites;
                // this.setState({ count: data.count, loading: false, playlist: playlist });
            });


        // fake favorite on client-side, for perceived speed
        var playlist = this.state.playlist;
        playlist.favorites = playlist.favorites ? playlist.favorites : {};
        var key = _.findKey(playlist.favorites, (username) => {
            return username == this.state.profile.username;
        });

        if (key) {
            delete playlist.favorites[key];
            this.setState({
                count: this.state.count - 1,
                playlist: playlist
            });
        } else {
            playlist.favorites[Math.floor(Math.random() * 10000)] = this.state.profile.username;
            this.setState({
                count: this.state.count + 1,
                playlist: playlist
            });
        }
    }

    loadVideo(track) {
        const { audio, audioPlaylist } = this.props;
        const { controller } = this.props.route;

        this.setState({ loading: true });
        var query = track.name + ' ' + track.artists[0].name;

        controller.videoSearch(query)
            .then((data) => {
                audioPlaylist.clearPlaylist();

                if (this.state.playlist.tracks.length > 1) {
                    var currentTrackIndex = _.findIndex(this.state.playlist.tracks, (currentTrack) => {
                        return currentTrack.id == track.id;
                    });
                    audioPlaylist.setPlaylist(this.state.playlist.tracks.slice(currentTrackIndex + 1, this.state.playlist.tracks.length));
                }

                audio.setData(data);
                this.setState({ loading: false });
            });
    }

    handleMenuAction(data) {
        const { controller } = this.props.route;

        if (data.action == 'Remove track') {
            // change locally to save time
            var updatedPlaylist = this.state.playlist;

            updatedPlaylist.tracks = _.filter(updatedPlaylist.tracks, (track) => {
                return track.id != data.track.id;
            });


            this.setState({ playlist: updatedPlaylist });
            controller.removeTrackFromPlaylist(this.props.params.playlist_key, [data.track.id])
                .then((data) => {
                    if (data.message) {
                        console.log('track removed');
                    }
                });
        }
    }

    handleChange(event) {
        var fields = {};
        if (event.target.name == 'editPrivate') {
            fields['editPrivate'] = event.target.checked;
        } else {
            fields[event.target.name] = event.target.value;
        }
        this.setState(fields);
    }

    handleSubmit() {
        this.setState({ loading: true });
        const { controller } = this.props.route;

        var updates = {
            name: this.state.editPlaylistName ? this.state.editPlaylistName : this.state.playlist.name,
            best_used_for: this.state.editBestUsedFor ? this.state.editBestUsedFor : this.state.playlist.best_used_for,
            mood: this.state.mood ? (typeof this.state.mood == 'object' ? this.state.mood.join(',') : this.state.mood) : this.state.playlist.mood,
            private: typeof this.state.editPrivate == 'boolean' ? this.state.editPrivate : 'nah'
        }

        controller.editMyPlaylist(this.props.params.playlist_key, updates)
            .then((data) => {
                data.tracks = this.state.playlist.tracks
                this.setState({ playlist: data, isEditDialogActive: false, loading: false });
            });
    }

    handleRecommendedPlaylistFavorite(playlistKey) {
        const { controller } = this.props.route;

        controller.favoritePlaylist(playlistKey)
            .then((data) => {
                this.getRecommendedPlaylists(this.state.playlist);
            });
    }

    handleUserAdded(users) {
        this.setState({ shareWithUsers: users });
    }

    handleShareSubmit() {
        console.log('submitted with users', this.state.shareWithUsers);
        this.setState({ loading: true });
        const { controller } = this.props.route;

        var usernames = _.map(this.state.shareWithUsers, (user) => {
            return user.text;
        });

        controller.sharePlaylistWithUsers(this.props.params.playlist_key, usernames)
            .then((data) => {
                this.setState({
                    loading: false,
                    isDialogActive: false,
                    shareWithUsers: [],
                    isSnackbarActive: true,
                    snackBarText: data.message
                });
            });
    }

    render() {
        { this.state.profile && console.log('keyying it up', this.state.profile); }
        return (
            <div>
                {this.state.users && this.state.isDialogActive &&
                    <ShareDialog
                        active={this.state.isDialogActive}
                        users={this.state.users}
                        tags={_.map(this.state.shareWithUsers, 'name')}
                        onNewTag={(u) => { this.handleUserAdded(u) }}
                        onClose={() => { this.setState({ isDialogActive: false, shareWithUsers: [] }) }}
                        onSubmit={() => { this.handleShareSubmit() }}
                        users={this.state.users} />}


                <div className="myContainer">
                    {this.state.playlist && typeof this.state.count != 'undefined' &&
                        <DetailedPlaylistView
                            playlist={this.state.playlist}
                            playlist_key={this.props.params.playlist_key}
                            onFavorite={() => { this.handleFavorite() }}
                            onPlayTrack={(track) => { this.loadVideo(track) }}
                            onMenuItemClick={(d) => { this.handleMenuAction(d) }}
                            onShare={() => { this.setState({ isDialogActive: true }) }}
                            favoritesCount={this.state.count}
                            favorited={_.includes(this.state.playlist.favorites, this.state.profile.username)}
                            editable={this.state.profile.userKey == this.state.playlist.creator_key}
                            onEdit={() => { this.setState({ isEditDialogActive: true }) }}
                        />}
                </div>

                {this.state.recommendedPlaylists && <div className="myContainer">
                    <h1>Recommended Playlists <span className="sub-header">based on similar tracks</span></h1>
                    <PlaylistList
                        playlists={this.state.recommendedPlaylists}
                        onFavorite={(key) => { this.handleRecommendedPlaylistFavorite(key) }}
                        username={this.state.profile.username} />
                </div>}

                <EditPlaylistDialog
                    playlist={this.state.playlist}
                    active={this.state.isEditDialogActive}
                    onMoodEnter={(moods) => { this.setState({ mood: _.map(moods, 'text') }, console.log(this.state)) }}
                    onClose={() => { this.setState({ isEditDialogActive: false }) }}
                    onChange={(e) => { this.handleChange(e) }}
                    onSubmit={() => { this.handleSubmit() }} />


                <Snackbar
                    active={this.state.isSnackbarActive}
                    onClick={() => { this.setState({ isSnackbarActive: false }) }}
                    onTimeout={() => { this.setState({ isSnackbarActive: false }) }}
                    action="Close">{this.state.snackBarText}</Snackbar>

                <Loader active={this.state.loading} />
            </div>
        );
    }
}

export default Playlist;