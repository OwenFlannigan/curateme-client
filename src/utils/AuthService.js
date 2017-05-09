import Auth0Lock from 'auth0-lock';
import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import { browserHistory } from 'react-router';
import _ from 'lodash';

export default class AuthService extends EventEmitter {
    constructor(clientId, domain) {
        super();

        this.lock = new Auth0Lock(clientId, domain, {
            auth: {
                redirectUrl: 'https://curateme.io/login',
                responseType: 'token'
            },
            theme: {
                logo: require('../../public/favicon.ico'),
                primaryColor: '#ff6363'
            },
            languageDictionary: {
                title: 'curate.me',
                signUpTerms: 'I am at least 13 years of age.'
            },
            usernameStyle: 'username',
            mustAcceptTerms: true
        });

        // callback for lock authenticated event
        this.lock.on('authenticated', this._doAuthentication.bind(this));

        // binds ligin function to keep context
        this.login = this.login.bind(this);
    }

    _doAuthentication(authResult) {
        // save user token
        this.setToken(authResult.idToken);
        browserHistory.replace('/');

        this.lock.getProfile(authResult.idToken, (error, profile) => {
            if (error) {
                console.log('Error loading the profile', error);
            } else {
                this.setProfile(profile);
            }
        });
    }

    login() {
        // display login widget
        this.lock.show();
    }

    loggedIn() {
        // check for valid saved token
        const token = this.getToken();
        return !!token && !isTokenExpired(token);
    }

    setToken(idToken) {
        // save token to local storage
        localStorage.setItem('id_token', idToken);
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    setProfile(profile) {
        this.fetch('/api/me/profile')
            .then((data) => {
                profile.username = data.username;
                profile.userKey = data.key;
                console.log('key in auth', data.key);
                console.log('profile in auth', profile);

                localStorage.setItem('profile', JSON.stringify(profile));
                this.emit('profile_updated', profile);
            });
    }

    getProfile() {
        var profile = localStorage.getItem('profile');

        // profile = profile ? JSON.parse(localStorage.profile) : {};
        // return this.fetch('/api/me/profile')
        //     .then((data) => {
        //         profile.username = data.username;
        //         return profile;
        //     });
        return profile ? JSON.parse(localStorage.profile) : {};
    }

    setSpotifyTokens(accessToken, refreshToken) {
        localStorage.setItem('spotify_access_token', accessToken);
        localStorage.setItem('spotify_refresh_token', refreshToken);
    }

    getSpotifyTokens() {
        return {
            "accessToken": localStorage.getItem('spotify_access_token'),
            "refreshToken": localStorage.getItem('spotify_refresh_token')
        }
    }

    logout() {
        // clear user token and profile data
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        browserHistory.replace('/login');
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    fetch(url, options) {
        // performs api calls with the required authentication headers
        console.log('fetching stuff');
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // if logged in, includes the authorization headers
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }
        console.log(this.getToken());

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus) // raise errors
            .then(response => response.json()); // parse JSON response
    }
}