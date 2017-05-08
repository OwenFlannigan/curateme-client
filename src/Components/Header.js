import React, { Component } from 'react';
import { IndexLink, browserHistory } from 'react-router';


class Header extends React.Component {
    render() {
        return (
            <header>
                <h1>curate<span>.</span>me</h1>
                <nav>
                    <IndexLink to="/" activeClassName="active">Home</IndexLink>
                    <IndexLink to="/playlists" activeClassName="active">My Playlists</IndexLink>
                    <IndexLink to="/radio" activeClassName="active">Radio</IndexLink>
                </nav>
            </header>
        );
    }
}

export default Header;