import React, { Component } from 'react';
import { ProgressBar } from 'react-mdl';

class Loader extends React.Component {
    render() {
        var loader = (
            <div className="loader-container">
                <ProgressBar indeterminate />
            </div>
        );

        return (
            <div>
                {this.props.active && loader}
            </div>
        );
    }
}

export default Loader;