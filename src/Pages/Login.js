import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import AuthService from '../utils/AuthService';

class Login extends React.Component {
    render() {
        const { auth } = this.props;

        return (
            <div className="myContainer">
                <h2>Click below to Login</h2>
                <button onClick={auth.login.bind(this)}>Login</button>
            </div>
        );
    }
}

export default Login;