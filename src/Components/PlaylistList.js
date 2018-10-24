import React, { Component } from 'react';
import { IndexLink, browserHistory, Link } from 'react-router';

import { Grid, Cell, Card, CardActions, CardMenu, CardText, CardTitle, IconButton, Button, Chip } from 'react-mdl';

import _ from 'lodash';


class PlaylistList extends React.Component {
    render() {
        var col = this.props.col ? this.props.col : 4;
        var tablet = this.props.col ? this.props.col : 4;
        var phone = this.props.col ? this.props.col : 12;

        var items = (Object.keys(this.props.playlists)).map((key, index) => {
            return (
                <Cell col={col} tablet={tablet} phone={phone} key={key + '-playlistListItem'}>
                    <PlaylistListItem
                        playlist={this.props.playlists[key]}
                        playlist_key={key}
                        onFavorite={() => { this.props.onFavorite(key) }}
                        username={this.props.username} />

                </Cell>
            );
        });

        return (
            <Grid style={{ padding: '0' }}>
                {items}
            </Grid>
        );
    }
}

class PlaylistListItem extends React.Component {

    // BACKGROUND IS CURRENTLY AGAINST SPOTIFY TERMS!!!!

    render() {
        var imageUrl = this.props.playlist.image ? this.props.playlist.image : this.props.playlist.tracks[0].album.images[0].url;


        if (this.props.playlist.mood) {
            var moods = this.props.playlist.mood.split(',').map((mood, index) => {
                return <Chip style={{ marginRight: '0.5rem' }} key={Math.random() + '-chip-' + index}>{mood}</Chip>;
            });
        }

        var icon = 'favorite_outline';
        if (this.props.playlist.favorites && _.includes(_.values(this.props.playlist.favorites), this.props.username)) {
            icon = 'favorite';
        }

        return (
            <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle style={{ color: '#fff', height: '200px', background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + imageUrl + ') center / cover', cursor: 'pointer' }} onClick={() => { browserHistory.push('/playlists/' + this.props.playlist_key) }}>
                    {this.props.playlist.name}
                </CardTitle>
                <CardText>
                    <p style={{ textTransform: 'lowercase' }}>For {this.props.playlist.best_used_for}</p>
                    <div>{moods}</div>
                </CardText>
                {/*<CardActions border>
                        <Button colored>View</Button>
                    </CardActions>*/}
                <CardMenu style={{ color: '#fff' }}>
                    <div style={{ display: 'inline-block', marginRight: '1rem' }}>{this.props.playlist.tracks ? _.values(this.props.playlist.tracks).length : '0'} tracks</div>
                    <IconButton name={icon} onClick={() => { this.props.onFavorite() }} />
                </CardMenu>
            </Card>
        );
    }
}

export { PlaylistListItem };
export default PlaylistList;