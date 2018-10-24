import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import { Grid, Cell, IconButton } from 'react-mdl';

class FriendFeed extends React.Component {
    render() {
        console.log(this.props.data);
        var favoritePlaylists = (Object.keys(this.props.data.favorites.playlists)).map((playlist) => {
            return <p>{this.props.data.name} <Link to={'/playlists/' + playlist.playlist_key}>favorited a playlist</Link></p>;
        });

        var favoriteUsers = (Object.keys(this.props.data.favorites.users)).map((user) => {
            return <p>{this.props.data.name} <Link to={'/users/' + user.user_key}>favorited a user</Link></p>;
        });

        var newPlaylists = (Object.keys(this.props.data.playlists)).map((playlist) => {
            return <p>{this.props.data.name} <Link to={'/playlists/' + playlist.playlist_key}>started a new playlist</Link></p>;
        });


        var items = _.concat(favoritePlaylists, favoriteUsers, newPlaylists).map((item) => {
            return <Cell col={4}>{item}</Cell>;
        });

        return (
            <Grid>
                {items}
            </Grid>
        );
    }
}

class FeedItem extends React.Component {
    render() {
        return (
            <div>
                <p></p>
            </div>
        );
    }
}

export default FriendFeed;