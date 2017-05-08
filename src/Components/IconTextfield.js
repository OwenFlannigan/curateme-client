import React, { Component } from 'react';
import Modal from 'react-modal';
import _ from 'lodash';

import { InputGroup, FormControl, FormGroup } from 'react-bootstrap';
import { Icon } from 'react-mdl';

import TagInput from './TagInput';


class IconTextfield extends React.Component {
    render() {
        console.log('icon text field', this.props.suggestions);
        return (
            <FormGroup className="icon-text-field">
                <InputGroup>
                    <InputGroup.Addon><Icon name={this.props.icon} /></InputGroup.Addon>
                    {/*<FormControl type="text" onChange={(e) => this.props.onChange(e)} />*/}
                    <TagInput
                        autocomplete
                        tags={this.props.tags ? this.props.tags : []}
                        onNewTag={this.props.onNewTag}
                        placeholder={this.props.placeholder}
                        suggestions={this.props.suggestions} />
                </InputGroup>
            </FormGroup>
        );
    }
}

export default IconTextfield;