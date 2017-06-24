import React, { Component } from 'react';
import Modal from 'react-modal';

import { IconButton, Checkbox } from 'react-mdl';
import { FormControl } from 'react-bootstrap';

import { MoodTagInput } from './TagInput';
import MessageList from './MessageList';
import IconTextfield from './IconTextfield';


import _ from 'lodash';


class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = { opacity: 0 };
    }

    componentDidMount() {
        this.setState({ opacity: 1 });
    }

    render() {
        var customStyle = {
            overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                zIndex: '10000',
                opacity: this.state.opacity
            },
            content: {
                position: 'relative',
                margin: 'auto',
                top: '50%',
                transform: 'translate(0%, -50%)',
                border: 'none',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '4px',
                outline: 'none',
                padding: '20px',
                zIndex: '10001',
                width: '40%',
                minWidth: '300px',
                height: 'auto',
                opacity: this.state.opacity,
                maxHeight: '70%'
            }
        };

        return (
            <Modal
                isOpen={true}
                contentLabel="modal"
                style={customStyle}
                className="dialog">

                <IconButton
                    name="close"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem'
                    }}
                    onClick={() => { this.props.onClose() }}
                />

                {this.props.children}
            </Modal>
        );
    }
}

class EditPlaylistDialog extends React.Component {
    render() {
        var editPrivate = <Checkbox name="editPrivate" onChange={(e) => this.props.onChange(e)} label="private" ripple />;
        if (this.props.playlist && this.props.playlist.private ? true : false) {
            editPrivate = <Checkbox name="editPrivate" onChange={(e) => this.props.onChange(e)} label="private" ripple defaultChecked />;
        }

        return (
            <div>
                {this.props.active &&
                    <Dialog
                        className="edit-playlist-dialog"
                        onClose={this.props.onClose}>
                        
                        <h1>Edit {this.props.playlist.name}</h1>
                        <label htmlFor="editPlaylistName">name</label>
                        <FormControl name="editPlaylistName" type="text" onChange={(e) => this.props.onChange(e)} placeholder={this.props.playlist.name} />

                        <label htmlFor="editBestUsedFor">best used for</label>
                        <FormControl name="editBestUsedFor" type="text" onChange={(e) => this.props.onChange(e)} placeholder={this.props.playlist.best_used_for} />

                        <label htmlFor="editMoods">moods</label>
                        <MoodTagInput name="editMoods"
                            tags={this.props.playlist.mood ? this.props.playlist.mood.split(',') : []}
                            onNewTag={(tags) => { this.props.onMoodEnter(tags) }} />

                        <div style={{ marginTop: '1rem' }}>
                            {editPrivate}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button onClick={this.props.onSubmit}>Submit</button>
                        </div>
                    </Dialog>}
            </div>
        );
    }
}

class InboxDialog extends React.Component {
    render() {
        return(
            <div>
                {this.props.active &&
                    <Dialog
                        className="inbox-dialog"
                        onClose={this.props.onClose}>
                        
                        <h1>My Inbox<IconButton name="refresh" onClick={this.props.onRefresh}/></h1>
                        {!_.values(this.props.messages).length && <p>No new messages.</p>}

                        {this.props.messages && 
                            <MessageList 
                                messages={this.props.messages}
                                onDeleteMessage={this.props.onDeleteMessage} />}
                        
                    </Dialog>}
            </div>
        );
    }
}

class AddFriendDialog extends React.Component {
    render() {
        var dialog = <Dialog onClose={this.props.onClose}>
            <h1>Add a Friend!</h1>
            <p>Who do you want to befriend?</p>
            <IconTextfield
                suggestions={this.props.users}
                placeholder="enter friends to add..."
                icon="search"
                onNewTag={this.props.onNewTag}
                tags={this.props.tags} />
                
            <div style={{ textAlign: 'right' }}>
                <button onClick={this.props.onSubmit}>{this.props.tags.length > 1 ? 'Add Friends' : 'Add Friend'}</button>
            </div>
        </Dialog>;

        return (
            <div>
                {this.props.active && dialog}
            </div>
        );
    }
}

export { EditPlaylistDialog, InboxDialog, AddFriendDialog };
export default Dialog;