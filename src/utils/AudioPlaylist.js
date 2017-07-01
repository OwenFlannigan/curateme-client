import _ from 'lodash';

export default class AudioPlaylist {
    constructor(data, controller) { // create using spotify track data

        this.controller = controller;
        console.log('audio playlist data', data);
        // controller.videoPlaylistSearch()
    }

    setPlaylist(data) {
        this.clearPlaylist();
        console.log('audio playlist data', data);
        this.spotifyData = data;
        this.loadAndSetVideoData();
    }

    clearPlaylist() {
        this.spotifyData = {};
        this.videoPlaylist = {};
    }

    loadAndSetVideoData() {
        if (this.spotifyData) {
            var videoQuery = this.spotifyData.map((track) => {
                return track.name + ' ' + track.artists[0].name;
            }).join(',');

            this.controller.videoPlaylistSearch(videoQuery)
                .then((data) => {

                    console.log(data);
                    this.videoPlaylist = data;
                });
        }
    }

    getNextTrack() {
        console.log('getting next track');
        if (this.videoPlaylist && this.videoPlaylist.length) {
            console.log('true');
            var result = this.videoPlaylist[0];
            this.videoPlaylist = this.videoPlaylist.slice(1, this.videoPlaylist.length);
            return result;
        }
    }


}