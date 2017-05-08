import AuthService from './AuthService';
import _ from 'lodash';

import firebase from 'firebase';

export default class DataController {
    constructor(auth) {
        this.auth = auth;
    }

    getMyProfile() {
        return this.auth.fetch('/api/me/profile')
            .then((data) => {
                return data;
            });
    }

    deleteMyMessage(messageKey) {
        var options = {
            method: 'DELETE',
            json: true
        }

        return this.auth.fetch('/api/me/profile/messages?message_key=' + messageKey, options)
            .then((data) => {
                return data;
            });
    }

    // Get all of my playlists
    getMyPlaylists() {
        // if (!this.playlists) {
        return this.auth.fetch('/api/me/playlists')
            .then((data) => {
                this.playlists = data;
                return data;
            });
        // } else {
        //     return this.playlists;
        // }
    }

    // Get one of my playlists
    getMyPlaylist(playlist_key) {
        if (this.playlists && this.playlists[playlist_key]) { // if stored
            return this.playlists[playlist_key];
        } else {
            return this.auth.fetch('/api/me/playlist?playlist_key=' + playlist_key)
                .then((data) => {
                    return data;
                });
        }
    }

    getPublicPlaylist(playlist_key) {
        return fetch('/api/playlist?playlist_key=' + playlist_key)
            .then((response) => {
                return response.json();
            });
    }

    addPlaylist(playlist) {
        if (typeof playlist.image === 'string') {
            return this.uploadPlaylist(playlist);
        } else {
            var key = firebase.database().ref('/key_generator').push().key;
            var storageRef = firebase.storage().ref();
            var imageRef = storageRef.child('/images/' + key);


            return imageRef.put(playlist.image).then((snapshot) => {
                playlist.image = snapshot.downloadURL;

                return this.uploadPlaylist(playlist);
            });
        }

    }

    editMyPlaylist(key, updates) {
        var options = {
            method: 'PUT',
            body: JSON.stringify({
                "name": updates.name,
                "best_used_for": updates.best_used_for,
                "mood": updates.mood,
                "private": updates.private
            }),
            json: true
        }

        console.log('sending with', options.body);
        var uri = '/api/me/playlist?playlist_key=' + key;

        return this.auth.fetch(uri, options);
    }

    addTrackToPlaylist(key, trackIds) {
        var options = {
            method: 'POST'
        }

        var uri = '/api/me/playlist/tracks?playlist_key=' + key + '&track_ids=' + trackIds.join(',');
        console.log('uri', uri);

        return this.auth.fetch(uri, options);
    }

    addSuggestionToPlaylist(track, playlistKey) {
        var options = {
            method: 'POST',
            body: JSON.stringify({
                "suggested_track": track,
                "playlist_key": playlistKey
            })
        }

        return this.auth.fetch('/api/playlist/suggest', options)
            .then((response) => {
                return response.json();
            }).then((data) => {
                return data;
            });
    }

    removeTrackFromPlaylist(key, trackIds) {
        var options = {
            method: 'DELETE'
        }

        var uri = '/api/me/playlist/tracks?playlist_key=' + key + '&track_ids=' + trackIds.join(',');

        return this.auth.fetch(uri, options);
    }

    uploadPlaylist(playlist) {
        var body = JSON.stringify({
            "best_used_for": playlist.best_used_for,
            "mood": playlist.mood,
            "name": playlist.name,
            "tracks": playlist.tracks,
            "image": playlist.image,
            "private": playlist.private
        });

        var options = {
            method: 'POST',
            body: body
        }

        return this.auth.fetch('/api/me/playlists', options);
    }

    getUsers() {
        return this.auth.fetch('/api/users')
            .then((data) => {
                return data;
            });
    }

    sharePlaylistWithUsers(playlist_key, usernames) {
        var options = {
            method: 'POST'
        };

        return this.auth.fetch('/api/users/share?playlist_key=' + playlist_key + '&usernames=' + usernames, options)
            .then((data) => {
                return data;
            });
    }

    addFriend(usernames) {
        var options = {
            method: 'POST'
        }

        return this.auth.fetch('/api/me/friends?usernames=' + usernames, options)
            .then((data) => {
                return data;
            });
    }

    removeFriend(friendKey) {
        var options = {
            method: 'DELETE',
            body: JSON.stringify({
                "friend_key": friendKey
            })
        }

        return this.auth.fetch('/api/me/friends', options)
            .then((data) => {
                return data;
            });
    }

    getFriendActivity() {
        return this.auth.fetch('/api/me/friends/activity')
            .then((data) => {
                return data;
            });
    }

    favoritePlaylist(playlist_key) {
        var options = {
            method: 'PUT'
        };

        return this.auth.fetch('/api/playlist/favorite?playlist_key=' + playlist_key, options)
            .then((data) => {
                return data;
            });
    }

    getPublicPlaylist(playlist_key) {
        if (this.auth.loggedIn()) { // to get private playlists that are your own
            return this.auth.fetch('/api/playlist?playlist_key=' + playlist_key)
                .then((data) => {
                    return data;
                });
        } else { // to get any public playlist
            return fetch('/api/playlist?playlist_key=' + playlist_key)
                .then((data) => {
                    return data;
                });
        }
    }

    getMultiplePublicPlaylists(playlist_keys) {
        return fetch('/api/playlist/multiple?playlist_keys=' + playlist_keys)
            .then((data) => {
                return data;
            });
    }

    getMyRecommendedTracks() {
        return this.auth.fetch('/api/me/recommendations/tracks')
            .then((data) => {
                return data;
            });
    }

    refreshMyRecommendedTracks() {
        console.log('getting rec tracks');
        return this.auth.fetch('/api/me/recommendations/refresh/tracks')
            .then((data) => {
                return data;
            });
    }

    getTopPlaylists() {
        return this.auth.fetch('/api/playlists/top')
            .then((data) => {
                return data;
            })
    }

    getRecommendedTracks(trackIds) {
        return fetch('/api/recommendations/tracks?seeds=' + trackIds.join(','))
            .then((response) => {
                return response.json();
            });
    }

    searchPlaylists(query, moods) {
        return fetch('/api/playlists/search?q=' + query + '&moods=' + moods.join(','))
            .then((response) => {
                return response.json();
            });
    }

    search(query) {
        return fetch('/api/search?q=' + query)
            .then((response) => {
                return response.json();
            });
    }

    // youtube
    videoSearch(query) {
        return fetch('/api/youtube/search?q=' + query)
            .then((response) => {
                return response.json();
            });
    }

    // events
    getEventsNearMe(position) {
        return fetch('/api/eventful/events?location=' + position.coords.latitude + ',' + position.coords.longitude)
            .then((response) => {
                return response.json();
            });
    }

}

var baseSpotifyUrl = 'https://api.spotify.com';

// used only for things that require spotify auth
class SpotifyController {
    constructor(auth) {
        this.auth = auth;
    }

    getPlaylistTracks(playlist_id, user_id) {
        console.log('getting tracks', this.auth.getSpotifyTokens());
        var resource = '/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks';
        var uri = baseSpotifyUrl + resource;


        var options = {
            headers: {
                'Authorization': 'Bearer ' + this.auth.getSpotifyTokens().accessToken,
                'Content-Type': 'application/json'
            }
        }

        return fetch(uri, options)
            .then((response) => {
                return response.json();
            });
    }
}

export { SpotifyController };