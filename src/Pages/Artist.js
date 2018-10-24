import React, { Component } from 'react';
import { Grid, Cell, Chip } from 'react-mdl';
import { Link, browserHistory } from 'react-router';

import FavoriteButton from '../Components/FavoriteButton';
import SongList from '../Components/SongList';
import Loader from '../Components/Loader';
import { ArtistPresentation } from './Search';





class Artist extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };


        this.loadData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.artist_key !== this.props.params.artist_key) {
            this.loadData(nextProps);
        }
    }

    loadData(props) {
        // this.setState({ loading: true });
        var id = props.params.artist_key;
        if (id) {
            const { controller } = props.route;
            console.log(controller);
            controller.artist(id)
                .then((data) => {
                    this.setState({
                        artist: data.artist,
                        relatedArtists: data.relatedArtists,
                        topTracks: data.topTracks
                    });

                    controller.artistDetails(data.artist.name)
                        .then((data) => {
                            this.setState({
                                description: data ? data.response.artist.description : '',
                                loading: false
                            });
                        });
                });

        } else {
            browserHistory.push('/');
        }
    }

    render() {
        var chips = [];
        if (this.state.artist) {
            var chips = this.state.artist.genres.map((genre, index) => {
                return <Chip style={{ marginRight: '0.5rem' }} key={genre + index}>{genre}</Chip>;
            });
        }

        return (
            <div className="myContainer">
                {!this.state.loading && !this.state.artist && <Grid>
                    <p>We couldn't find the artist you were looking for :/</p>
                </Grid>}

                {this.state.artist && <Grid noSpacing className="artist-grid">

                    <Cell col={9} tablet={12} phone={12} style={{ position: 'relative' }}>
                        <h1 style={{ paddingLeft: '0' }}>{this.state.artist.name}</h1>
                        <h2>ranked {this.state.artist.popularity} in popularity</h2>

                        <div className="detailed-playlist-actions">
                            <div>{chips}</div>
                            <button onClick={this.props.onShare}>Share</button>
                            <FavoriteButton
                                onClick={() => { this.props.onFavorite() }}
                                count={this.props.favoritesCount}
                                playlist_key={this.props.playlist_key}
                                favorited={this.props.favorited} />
                        </div>
                    </Cell>

                    <Cell col={3} hideTablet hidePhone>
                        <img
                            className="responsive-img"
                            src={this.state.artist.images[0].url}
                            alt={this.state.artist.name + ' photo'} />
                    </Cell>

                    <Cell col={(this.state.description && this.state.description.plain.length > 50) ? 6 : 12} phone={12} tablet={12}>
                        {this.state.topTracks && <div>
                            <h1>top tracks</h1>
                            <SongList
                                tracks={this.state.topTracks}
                                onPlayTrack={(track) => { this.props.onPlayTrack(track) }}
                                menuItems={['Add to playlist', 'Show Similar Songs']}
                                onMenuItemClick={(d) => { this.props.onMenuItemClick(d) }} />
                        </div>}
                    </Cell>

                    <Cell col={5} offsetDesktop={1} phone={12} tablet={12}>
                        {this.state.description && this.state.description.plain.length > 50 &&
                            <div>
                                <h1>description</h1>
                                <p><span className="artist-description" dangerouslySetInnerHTML={{ __html: this.state.description.html }}></span></p>
                            </div>}
                    </Cell>

                    <Cell col={12}>
                        {this.state.relatedArtists &&
                            <Grid>
                                <h1 style={{ width: '100%' }}>related artists</h1>
                                {this.state.relatedArtists.map((artist, index) => {
                                    return (
                                        <Cell col={2} className="related-artist-card" key={'related-artist-card-' + index}>
                                            <Link to={'/artists/' + artist.id} className="related-artist-card-link">
                                                <img
                                                    className="artist-pres-album responsive-img"
                                                    src={artist.images[0].url}
                                                    alt={artist.name}
                                                />
                                            </Link>
                                        </Cell>
                                    );
                                })}
                            </Grid>}
                    </Cell>

                </Grid>}
                <Loader active={this.state.loading} />

            </div>
        );
    }
}

export default Artist;