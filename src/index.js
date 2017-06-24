import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
import App from './App';
import 'whatwg-fetch';
import 'promise-polyfill';

import firebase from 'firebase';

// Auth
import AuthService from './utils/AuthService';
// DataController
import DataController, { SpotifyController } from './utils/DataController';
import AudioController from './utils/AudioController';
import AudioPlaylist from './utils/AudioPlaylist';

// Pages
import Login from './Pages/Login';
import Home from './Pages/Home';
import Playlists from './Pages/Playlists';
import Playlist from './Pages/Playlist';
import AddPlaylist from './Pages/AddPlaylist';
import Events from './Pages/Events';
import Search from './Pages/Search';

import NotFound from './Components/NotFound';
import ComingSoon from './Components/ComingSoon';
import RedirectManager from './Components/RedirectManager';

// CSS
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './index.css';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCSuEs6V-a1Q5oo-ewNYFKz3QNHlV3Jsas",
  authDomain: "curate-me-a42fc.firebaseapp.com",
  databaseURL: "https://curate-me-a42fc.firebaseio.com",
  projectId: "curate-me-a42fc",
  storageBucket: "curate-me-a42fc.appspot.com",
  messagingSenderId: "177335232827"
};
firebase.initializeApp(config);

const auth = new AuthService('ZM0A6Syn4uYCI0euTMWrphGaw2Qe8H7l', 'owenflannigan.auth0.com');

const controller = new DataController(auth);
const spotify = new SpotifyController(auth);

const audio = new AudioController('');
const playlist = new AudioPlaylist('', controller);

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: 'login' });
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App} auth={auth} controller={controller} audioController={audio} audioPlaylist={playlist}>
      <IndexRedirect to="/home" />
      <Route path="home" component={Home} onEnter={requireAuth} controller={controller} />

      <Route path="playlists" onEnter={requireAuth}>
        <IndexRoute component={Playlists} onEnter={requireAuth} controller={controller} />
        <Route path="/playlists/add" component={AddPlaylist} onEnter={requireAuth} controller={controller} />
        <Route path="/playlists/:playlist_key" component={Playlist} onEnter={requireAuth} controller={controller} spotify={spotify} />
      </Route>

      <Route path="users">
        <IndexRoute component={ComingSoon} />
        <Route path="/users/:user_key" component={ComingSoon} />
      </Route>

      <Route path="artists">
        <IndexRoute component={ComingSoon} />
        <Route path="/artists/:artist_key" component={ComingSoon} />
      </Route>

      <Route path="events" component={Events} controller={controller} />
      <Route path="search" component={Search} controller={controller} />
      <Route path="login" component={Login} />
      <Route path="redirect/:tokens" component={RedirectManager} />

      {/* Not found page */}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>,
  document.getElementById('root')
);
