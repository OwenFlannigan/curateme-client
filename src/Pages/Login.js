import React from 'react';
import { Grid, Cell } from 'react-mdl';
import { browserHistory } from 'react-router';

import { ButtonToolbar, Button } from 'react-bootstrap';
import AuthService from '../utils/AuthService';

class Login extends React.Component {

    render() {
        const { auth } = this.props;

        auth.handleAuthentication();

        // console.log('authin it here', auth.isAuthenticated());
        // if(auth.isAuthenticated()) {
        //     browserHistory.replace('/');
        // }

        return (
            <div className="myContainer">
                <Grid>
                    <Cell col={6} tablet={12} style={ styles.Cell }>
                        <h1 style={{ paddingLeft: '0' }}>Click below to Login</h1>
                        <button onClick={auth.login.bind(this)}>Login</button>
                    </Cell>
                    <Cell hideTablet hidePhone col={6} style={{ ...styles.Cell, ...styles.BorderLeft, paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <p>Welcome to curate.me, your personlized hub for community-driven music sharing!</p>
                    </Cell>
                </Grid>

            </div>
        );
    }
}

const styles = {
    Cell: {
        textAlign: 'center',
        padding: '5rem 0',
        marginTop: '5rem'
    },
    BorderLeft: {
        borderLeft: '1px solid lightgray'
    }
};

export default Login;