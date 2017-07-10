import React from 'react';
import { browserHistory, Link } from 'react-router';

import { Grid, Cell, Card, CardTitle, CardActions, Icon, Checkbox } from 'react-mdl';
import { InputGroup, FormControl, FormGroup } from 'react-bootstrap';
import { MoodTagInput } from '../Components/TagInput';
import SongList from '../Components/SongList';
import PlaylistList from '../Components/PlaylistList';

import Loader from '../Components/Loader';

import _ from 'lodash';
import firebase from 'firebase';



class AddPlaylist extends React.Component {
    constructor(props) {
        super(props);

        this.state = { message: "Add some details to get suggested tracks and playlists!" };
        this.loadSuggestedPlaylists = this.loadSuggestedPlaylists.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    loadSuggestedPlaylists(moods) {
        this.setState({ loading: true, mood: _.map(moods, 'text') });
        const { controller } = this.props.route;

        var query = this.state.best_used_for ? this.state.best_used_for : '';
        // console.log('query', this.state);

        controller.searchPlaylists(query, _.map(moods, 'text'))
            .then((data) => {
                if (data.length) {
                    this.setState({ suggestedPlaylists: data.slice(0, 3) });

                    var tracks = _.flatten(_.map(data, 'tracks'));
                    var limit = Math.min(tracks.length, 5);
                    var tracks = _.shuffle(tracks).slice(0, 5);

                    
                    // console.log('tracks here', _.values(tracks[0]));
                    this.loadSuggestedTracks(_.values(tracks[0]));
                } else {
                    this.setState({ message: "No suggestions yet, keep adding moods!", loading: false });
                }
            });
    }

    loadSuggestedTracks(trackIds) {
        const { controller } = this.props.route;

        controller.getRecommendedTracks(trackIds)
            .then((data) => {
                if (this.state.savedTracks) {
                    data = _.concat(_.values(this.state.savedTracks), data);
                }
                // console.log('tracks', data);
                this.setState({ suggestedTracks: data, loading: false });
            });
    }

    loadVideo(track) {
        // console.log('loading track', track);
        const { audio } = this.props;
        const { controller } = this.props.route;

        this.setState({ loading: true });
        var query = track.name + ' ' + track.artists[0].name;

        controller.videoSearch(query)
            .then((data) => {
                data.trackId = track.id;
                audio.setData(data);
                this.setState({ loading: false });
            });
    }

    updateState(newState) {
        this.setState(newState);
    }

    handleSubmit(data) {
        const { controller } = this.props.route;

        if (this.state.savedTracks) {
            var tracks = _.keys(this.state.savedTracks);
        }

        this.setState({ loading: true, disabled: true });
        var playlist = {
            name: data.name,
            best_used_for: data.best_used_for ? data.best_used_for : 'listening',
            mood: this.state.mood ? this.state.mood.join(',') : '',
            private: data.private ? true : false,
            image: data.fileData ? data.fileData : data.image,
            tracks: tracks ? tracks : {}
        }

        controller.addPlaylist(playlist)
            .then((data) => {
                browserHistory.push('/playlists/' + data.key);
            });
    }

    render() {
        return (
            <div className="myContainer">
                <Grid>
                    <Cell col={12}>
                        <h1>Create a Playlist</h1>
                        <PlaylistCreationForm
                            onMoodEnter={this.loadSuggestedPlaylists}
                            onSubmit={(data) => { this.handleSubmit(data) }}
                            disabled={this.state.disabled}
                            updateParent={this.updateState} />
                    </Cell>

                    {!this.state.suggestedPlaylists &&
                        <Cell col={12}>
                            <p className="add-playlist-message">{this.state.message}</p>
                        </Cell>}

                    <Cell col={6} tablet={12} phone={12}>
                        {this.state.suggestedPlaylists &&
                            <div>
                                <h1>playlists to try</h1>
                                <PlaylistList
                                    col={12}
                                    playlists={this.state.suggestedPlaylists} />
                            </div>}
                    </Cell>

                    <Cell col={6} tablet={12} phone={12}>
                        {(this.state.suggestedTracks && this.state.suggestedTracks.length) &&
                            <div>
                                <h1>suggested tracks</h1>
                                <SongList
                                    tracks={this.state.suggestedTracks}
                                    onPlayTrack={(track) => { this.loadVideo(track) }}
                                    checkedIndexes={this.state.savedTracks ? this.state.savedTracks.length : 0} // 0 to index are checked
                                    checkable
                                    onItemChecked={(checkedTracks) => { this.setState({ savedTracks: checkedTracks }) }} />
                            </div>}
                    </Cell>
                </Grid>

                <Loader active={this.state.loading} />
            </div>
        );
    }
}

class PlaylistCreationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { fileName: 'random image' };
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    componentDidMount() {
        var image = 'http://students.washington.edu/oflann/dope.jpg';
        firebase.database().ref('/images').once('value', (snapshot) => {
            var data = snapshot.val();

            if (data) {
                this.setState({ image: _.sample(data) });
            } else {
                this.setState({ image: 'http://students.washington.edu/oflann/dope.jpg' });
            }
        });
    }

    handleChange(event) {
        var fields = {};
        fields[event.target.name] = event.target.value;
        this.setState(fields);
        this.props.updateParent(fields);
    }

    handleImageChange(event) {
        var input = event.target;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.setState({
                    image: e.target.result,
                    fileName: input.files[0].name,
                    fileData: input.files[0]
                });
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    render() {
        var submit = <button onClick={() => { this.props.onSubmit(this.state) }}>Submit</button>;
        if (this.props.disabled) {
            submit = <button disabled onClick={() => { this.props.onSubmit(this.state) }}>Submit</button>;
        }

        return (
            <Grid>
                <Cell col={3} tablet={12} phone={12}>
                    <Card className="add-playlist-image" shadow={0} style={{ width: '100%', height: '100%', background: 'url(' + this.state.image + ') center / cover', margin: 'auto' }}>
                        <CardTitle expand />
                        <CardActions style={{ height: '52px', padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
                            <span className="image-card-title">{this.state.fileName}</span>
                            <input
                                type="file"
                                onChange={this.handleImageChange} />
                            <div className="drag-and-drop-dialog"></div>
                        </CardActions>
                    </Card>

                    {/*<img className="responsive-img" src={this.state.image} alt="playlist image" />*/}
                </Cell>

                <Cell col={9} tablet={12} phone={12}>
                    <FormGroup className="add-playlist-form">
                        <FormControl
                            name="name"
                            type="text"
                            placeholder="playlist name"
                            onChange={(e) => this.handleChange(e)} />

                        <FormControl
                            name="best_used_for"
                            type="text"
                            placeholder="best used for..."
                            onChange={(e) => this.handleChange(e)} />

                        <MoodTagInput
                            name="mood"
                            onNewTag={(tags) => { this.props.onMoodEnter(tags) }} />

                        <Checkbox name="private" ripple label="private" onChange={(e) => this.handleChange(e)} />

                    </FormGroup>
                    <div style={{ textAlign: 'right' }}>
                        {submit}
                    </div>
                </Cell>

            </Grid>
        );
    }
}

export default AddPlaylist;
