import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import _ from 'lodash';

import { Grid, Cell } from 'react-mdl';


class ActivityBoard extends React.Component {
    render() {
        var activities = (Object.keys(this.props.data)).map((key) => {
            var friendActivity = this.props.data[key].recent_activity;
            var friendName = this.props.data[key].name;

            var playlistActivities = [];
            var favoritedPlaylistsActivities = [];
            var favoritedUsersActivities = [];

            if (friendActivity.playlists) {
                playlistActivities = (Object.keys(friendActivity.playlists)).map((innerKey) => {
                    return <ActivityBoardItem
                        userName={friendName}
                        userKey={key}
                        activity={'created a new playlist'}
                        link={'/playlists/' + friendActivity.playlists[innerKey].playlist_key}
                        image={friendActivity.playlists[innerKey].image}
                    />;
                });
            }

            if (friendActivity.favorites && friendActivity.favorites.playlists) {
                favoritedPlaylistsActivities = (Object.keys(friendActivity.favorites.playlists)).map((innerKey) => {
                    return <ActivityBoardItem
                        userName={friendName}
                        userKey={key}
                        activity={'favorited a playlist'}
                        link={'/playlists/' + friendActivity.favorites.playlists[innerKey].playlist_key}
                        image={friendActivity.favorites.playlists[innerKey].image} />;
                });
            }

            if (friendActivity.favorites && friendActivity.favorites.users) {
                favoritedUsersActivities = (Object.keys(friendActivity.favorites.users)).map((innerKey) => {
                    return <ActivityBoardItem
                        userName={friendName}
                        userKey={key}
                        activity={'favorited a user'}
                        link={'/users/' + friendActivity.favorites.users[innerKey].user_key}
                        image={friendActivity.favorites.users[innerKey].image} />;
                });
            }

            return _.concat(playlistActivities, favoritedPlaylistsActivities, favoritedUsersActivities);
        });

        return (
            <Grid style={{ padding: '0' }}>
                {activities}
            </Grid>
        );
    }
}

class ActivityBoardItem extends React.Component {
    render() {
        return (
            <Cell col={4} tablet={4} phone={12}
                className="activity-board-card myCard">
                <Grid noSpacing style={{ height: '100%' }}>
                    <Cell col={9} tablet={6} phone={3} style={{ margin: 'auto' }}>
                        <h2><Link to={'/users/' + this.props.userKey}>{this.props.userName}</Link></h2>
                        <p><Link to={this.props.link}>{this.props.activity}</Link></p>
                    </Cell>
                    <Cell col={3} tablet={2} phone={1} style={{ margin: 'auto', textAlign: 'center' }}>
                        <img src={this.props.image} className="responsive-img" />
                    </Cell>
                </Grid>
            </Cell>
        );
    }
}

{/*<Cell col={4}>
                <p>
                    <Link to={'/users/' + this.props.userKey}>{this.props.userName}</Link><Link to={this.props.link}>{this.props.activity}</Link>
                </p>
            </Cell>*/}
export default ActivityBoard;