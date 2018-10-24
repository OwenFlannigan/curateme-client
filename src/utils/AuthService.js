import auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import { browserHistory } from 'react-router';
import _ from 'lodash';

export default class Auth extends EventEmitter {
    auth0 = new auth0.WebAuth({
        domain: 'owenflannigan.auth0.com',
        clientID: 'ZM0A6Syn4uYCI0euTMWrphGaw2Qe8H7l',
        redirectUri: 'http://localhost:3001/login',
        responseType: 'token id_token'
    });

    constructor() {
        super();
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if(authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                browserHistory.replace('/home');
            } else if (err) {
                browserHistory.replace('/login');
                console.log(err)
            }
        });
    }

    setSession(authResult) {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        browserHistory.replace('/home');
    }

    login() {
        this.auth0.authorize();
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        
        browserHistory.replace('/login');
    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }


    _doAuthentication(authResult) {
        // save user token
        this.setToken(authResult.idToken);
        browserHistory.replace('/home');

        this.lock.getProfile(authResult.idToken, (error, profile) => {
            if (error) {
                console.log('Error loading the profile', error);
            } else {
                this.setProfile(profile);
            }
        });
    }

    // login() {
    //     // display login widget
    //     this.lock.show();
    // }

    loggedIn() {
        // check for valid saved token
        // const token = this.getToken();
        // return !!token && !isTokenExpired(token);

        return this.isAuthenticated();
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

    // logout() {
    //     // clear user token and profile data
    //     localStorage.removeItem('id_token');
    //     localStorage.removeItem('profile');
    //     localStorage.removeItem('spotify_access_token');
    //     localStorage.removeItem('spotify_refresh_token');
    //     browserHistory.replace('/login');
    // }

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
        if (this.isAuthenticated()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }
        // console.log(this.getToken());

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus) // raise errors
            .then(response => response.json()); // parse JSON response
    }
}