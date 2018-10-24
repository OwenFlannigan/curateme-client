import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Snackbar } from 'react-mdl';

import Loader from '../Components/Loader';
import ShareDialog from '../Components/ShareDialog';
import PlaylistList from '../Components/PlaylistList';

import QueryString from 'query-string';
import _ from 'lodash';

class Playlists extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isSnackbarActive: false, loading: true };

        this.handleHideSnackbar = this.handleHideSnackbar.bind(this);
        this.loadData();
    }

    loadData() {
        const { auth } = this.props;
        const { controller } = this.props.route;


        controller.getMyProfile()
            .then((data) => {
                this.setState({
                    username: data.username
                });
            });

        this.loadPlaylists();
    }

    loadPlaylists() {
        const { controller } = this.props.route;

        controller.getMyPlaylists()
            .then((data) => {
                this.setState({ playlists: data, loading: false });
            });
    }

    handleHideSnackbar() {
        this.setState({
            isSnackbarActive: false,
            snackBarText: ''
        });
    }

    handleFavorite(playlistKey) {
        const { controller } = this.props.route;

        controller.favoritePlaylist(playlistKey)
            .then((data) => {
                this.loadPlaylists();
            });
    }

    render() {
        return (
            <div className="myContainer">
                {this.state.users && <ShareDialog
                    active={this.state.isDialogActive}
                    onChange={console.log}
                    onClose={() => { this.setState({ isDialogActive: false }) }}
                    users={this.state.users} />}

                <h1 style={{ paddingLeft: '0' }}>My Playlists <span className="sub-header"><a href="http://localhost:3000/api/spotify">import</a></span></h1>

                {this.state.playlists && _.values(this.state.playlists).length == 0 &&
                    <p>Add some playlists, or use the import bottom above to import your playlists from Spotify!</p>}

                {this.state.playlists &&
                    <PlaylistList
                        key="user_playlist_list"
                        playlists={this.state.playlists}
                        username={this.state.username}
                        onFavorite={(key) => { this.handleFavorite(key) }} />}


                <Snackbar
                    active={this.state.isSnackbarActive}
                    onClick={this.handleHideSnackbar}
                    onTimeout={this.handleHideSnackbar}
                    action="Close">
                    {this.state.snackBarText}
                </Snackbar>

                <Loader active={this.state.loading} />
            </div>
        );
    }
}

export default Playlists;