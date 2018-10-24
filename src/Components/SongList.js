import React, { Component } from 'react';
import { IndexLink, browserHistory, Link } from 'react-router';

import { Icon, Checkbox, IconButton, Menu, MenuItem } from 'react-mdl';

import _ from 'lodash';

class SongList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.checkedItems = {};
    }

    togglePlayback(track) {
        // // Same song
        // if (this.props.audio.src == track.preview_url) {
        //     if (this.props.audio.paused) { // if paused, play
        //         this.props.audio.play();
        //         this.setState({ paused: false });
        //     } else { // if playing, pause
        //         this.props.audio.pause();
        //         this.setState({ paused: true });
        //     }
        // } else { // different song, pause old, play new
        //     this.props.audio.pause();
        //     this.props.audio.src = track.preview_url
        //     this.setState({
        //         currentId: track.id,
        //         paused: false
        //     }, () => {
        //         this.props.audio.play();
        //         this.props.audio.onended = () => {
        //             this.setState({ paused: true });
        //         };
        //     });
        // }
    }

    loadTrack(track) {
        this.props.onPlayTrack(track);
    }

    handleItemChecked(event, track) {
        if (event.target.checked) {
            this.checkedItems[track.id] = track;
        } else {
            delete this.checkedItems[track.id];
        }
        this.props.onItemChecked(this.checkedItems);
    }

    render() {
        var items = (Object.keys(this.props.tracks)).map((key, index) => {
            var track = this.props.tracks[key];
            var icon = 'play_arrow';
            if (track.id == this.state.currentId && !this.state.paused) {
                icon = stop;
            }

            // var icon = 'error_outline'; // no preview available
            // if(track.preview_url) {
            //     var icon = 'play_arrow';
            //     if (track.id == this.state.currentId && !this.state.paused) {
            //         icon = 'stop';
            //     }
            // }

            if (this.props.menuItems) {
                var menuItems = this.props.menuItems.map((item, index) => {
                    return (
                        <MenuItem
                            key={item + '-' + track.id}
                            onClick={() => {
                                this.props.onMenuItemClick({
                                    track: track,
                                    action: item
                                })
                            }}>
                            {item
                            }</MenuItem>
                    );
                });
            }

            return <SongListItem
                track={track}
                key={key + '-trackItem'}
                listItemClassName={this.props.listItemClassName}
                onClick={() => { this.loadTrack(track) }}//this.togglePlayback(track) } }
                icon={icon}
                checkable={this.props.checkable}
                onChecked={(e) => { this.handleItemChecked(e, track) }}
                checked={(index < this.props.checkedIndexes)}>

                {this.props.menuItems && <div style={{ position: 'relative' }}>
                    <IconButton name="more_vert" id={index + track.id + '-menu'} />
                    <Menu target={index + track.id + '-menu'} valign={index > 2 ? 'top' : 'bottom'} align="right">
                        {menuItems}
                    </Menu>
                </div>}
            </SongListItem >


        });

        return (
            <ul className="song-list">
                {items}
            </ul>
        );
    }
}

class SongListItem extends React.Component {
    render() {
        var checkbox = <Checkbox
            className="song-list-checkbox"
            ripple
            onChange={this.props.onChecked} />

        if (this.props.checked) {
            checkbox = <Checkbox
                className="song-list-checkbox"
                ripple
                onChange={this.props.onChecked}
                checked />
        }

        return (
            <li className="song-list-item">
                {this.props.checkable &&
                    checkbox}

                <Icon
                    name={this.props.icon}
                    onClick={this.props.onClick}
                    style={{ verticalAlign: 'text-bottom', marginRight: '1rem', cursor: 'pointer' }}
                />
                <span className={this.props.listItemClassName}>{this.props.track.name}</span>
                <span className="sub-header">
                    {this.props.track.artists && <Link to={'/artists/' + this.props.track.artists[0].id}>{' ' + this.props.track.artists[0].name}</Link>}
                </span>

                <div style={{ float: 'right' }}>
                    {this.props.children}
                </div>
            </li>
        );
    }
}

export { SongListItem };
export default SongList;