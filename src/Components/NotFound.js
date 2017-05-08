import React, { Component } from 'react';


class NotFound extends React.Component {
    render() {
        return (
            <div className="myContainer">
                <h1 style={{ paddingLeft: '0' }}>404 page not found</h1>
                <p>Ooops. Looks like you were trying to go to a page that doesn't exist. But it's cool, this page isn't so bad. Just very blank.</p>

                {/* Maybe put cool stuff here, like things to promote music! */}
            </div>
        );
    }
}

export default NotFound;