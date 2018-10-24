import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Loader from './Loader';


export default class Manager extends React.Component {
    constructor(props) {
        super(props);

        this.callApis();
        this.state = { loading: true };
    }

    callApis() {
        const { auth } = this.props;

        var accessToken = this.props.params.tokens.split('&')[0].split('=')[1];
        var refreshToken = this.props.params.tokens.split('&')[1].split('=')[1];

        if (this.props.params.tokens) {
            auth.setSpotifyTokens(accessToken, refreshToken);
        }


        // browserHistory.replace('/playlists');
        auth.fetch('/api/spotify/import?access_token=' + accessToken + '&spotify_user_id=owenflannigan')
            .then((data) => {
                if (data.message) {
                    browserHistory.replace('/playlists');
                }
            });

    }

    render() {
        return (
            <div className="container">
                <h3>Spotify login successful! Importing playlists...</h3>

                <Loader active={this.state.loading} />
            </div>
        );
    }
}