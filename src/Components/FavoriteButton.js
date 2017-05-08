import React, { Component } from 'react';
import { Icon } from 'react-mdl';

class FavoriteButton extends React.Component {
    render() {
        var icon = this.props.favorited ? 'favorite' : 'favorite_outline';
        return (
            <button className="unstylized" onClick={this.props.onClick}>
                <Icon name={icon} className="favoriteIcon"/><span className="favoriteText">{this.props.count}</span>
            </button>
        );
    }
}

export default FavoriteButton;