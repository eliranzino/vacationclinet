import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginAction } from '../../actions';
import { Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import { State } from '../../store';
import './Login.css'


interface LoginProps {
    login(userName: string, password: string): void;
    isLoggedIn: boolean;
}

interface LoginState {
    userName: string;
    password: string;
}

class _Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        userName: '',
        password: '',
    }

    render() {
        const { userName, password } = this.state;
        const { isLoggedIn } = this.props;
        
            if (isLoggedIn) {
                return <Redirect to="/vacations"/>;
            } 
        
        return (
            <div className="login">
                <h4>Login:</h4>
                <form onSubmit={this.onSubmit}>
                <label>User name: </label>
                {' '}
                    <input name="userName" value={userName} onChange={this.handleInputChange} placeholder="Enter user name..." required />
                    <label>Password: </label>
                    {' '}
                    <input className='input' name="password" value={password} onChange={this.handleInputChange} type="password" placeholder="Enter password..." required />
                    <br />
                    <Button type="submit">Login</Button>
                </form>
                <div>
                    New user? Register <Link to="/register">CLICK HERE TO REGISTER</Link>
                </div>
            </div>
        );
    }
    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { userName, password } = this.state;
        const { login } = this.props;
        console.log({ userName, password } );
        login(userName, password);
   
    }
    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

}
const mapDispatchToProps = {
    login: loginAction,
}
const mapStateToProps = (state: State) => {
    return {
        isLoggedIn: state.isLoggedIn
    };
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);