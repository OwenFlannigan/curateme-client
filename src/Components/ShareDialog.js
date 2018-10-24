import React, { Component } from 'react';
import Dialog from '../Components/Dialog';
import IconTextfield from '../Components/IconTextfield';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class ShareDialog extends React.Component {
    render() {
        var dialog = <Dialog onClose={this.props.onClose}>
            <h1>Share this playlist?</h1>
            <p>Who do you want to send this playlist to?</p>
            <IconTextfield
                suggestions={this.props.users}
                placeholder="enter friends to share with..."
                icon="search"
                onNewTag={this.props.onNewTag}
                tags={this.props.tags} />
                
            <div style={{ textAlign: 'right' }}>
                <button onClick={this.props.onSubmit}>Submit</button>
            </div>
        </Dialog>;

        return (
            <div>
                {this.props.active && dialog}
            </div>
        );
    }
}

export default ShareDialog;