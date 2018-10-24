import React, { Component } from 'react';

import { IconButton, Checkbox } from 'react-mdl';
import _ from 'lodash';


class MessageList extends React.Component {
    render() {
        var messages = [];
        _.forEach(this.props.messages, (message, key) => {
            console.log('message list messages', key);
            messages.push(<MessageListItem
                message={message} key={key + '-message-list-item'}
                onDeleteMessage={() => { this.props.onDeleteMessage(key) }} />);
        });
        return (
            <ul className="message-list">
                {messages}
            </ul>
        );
    }
}

class MessageListItem extends React.Component {
    render() {
        return (
            <li className="message-list-item">
                <div style={{ display: 'inline-block', verticalAlign: 'sub' }}>
                    {this.props.message}
                </div>
                <div style={{ display: 'inline-block', float: 'right' }}>
                    <IconButton name="delete" onClick={this.props.onDeleteMessage} />
                </div>
            </li>
        );
    }
}

export default MessageList;