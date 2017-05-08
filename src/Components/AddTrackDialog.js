import React, { Component } from 'react';
import Dialog from '../Components/Dialog';

class AddTrackDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = { playlistKey: this.props.options[0] ? this.props.options[0].key : '' };
    }

    handleChange(event) {
        var fields = {};
        fields[event.target.name] = event.target.value;
        this.setState(fields);
        console.log('fs', fields);
    }

    render() {
        if (this.props.options) {
            var options = this.props.options.map((option, index) => {
                return (
                    <option
                        value={option.key}
                        key={option.key + index + '-option'}>

                        {option.name}
                    </option>
                );
            });
        }

        var dialog = <Dialog onClose={this.props.onClose}>
            <h1>Add to playlist</h1>
            <div style={{ background: '#f4f4f4', padding: '0', margin: '1rem 0' }}>
                <select name="playlistKey" onChange={(e) => { this.handleChange(e) }}>
                    <option>select a playlist</option>
                    {options}
                </select>
            </div>
            <div style={{ textAlign: 'right' }}>
                <button onClick={() => { this.props.onAction(this.state.playlistKey) }} style={{ marginRight: 0 }}>add</button>
            </div>
        </Dialog>;

        return (
            <div>
                {this.props.active && dialog}
            </div>
        );
    }
}

export default AddTrackDialog;