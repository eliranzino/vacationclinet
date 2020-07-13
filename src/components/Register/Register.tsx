import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import { registerAction } from '../../actions';
import { Button } from 'react-bootstrap';
import './Register.css'
import { Redirect, Link } from 'react-router-dom';
import { State } from '../../store';


interface RegisterProps {
    register(firstName: string, lastName: string, userName: string, password: string): void;
    isLoggedIn:Boolean;
}

interface RegisterState {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    isLoggin: boolean;
}

class _Register extends React.Component<RegisterProps, RegisterState> {
    state: RegisterState = {
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        isLoggin: false,
    }

    render() {
        const { firstName, lastName, userName, password } = this.state;
        const { isLoggedIn } = this.props;

            if (isLoggedIn) {
                return <Redirect to="/vacations" />;
            } 
        
        return (
            <div>
                <h4>Register:</h4>
                <form onSubmit={this.onSubmit}>
                <label>First name: </label>
                {' '}
                <input name="firstName" value={firstName} onChange={this.handleInputChange} placeholder="Enter your first name..." required />
                <label>Last Name: </label>
                {' '}
                <input name="lastName" value={lastName} onChange={this.handleInputChange} placeholder="Enter your last name..." required />
                <label>User name: </label>
                {' '}
                    <input name="userName" value={userName} onChange={this.handleInputChange} placeholder="Enter userName..." required />
                    <label>Password: </label>
                    {' '}
                    <input className='input' name="password" value={password} onChange={this.handleInputChange} type="password" placeholder="Enter password..." required />
                    <br/>
                    <Button type="submit">REGISTER</Button>
                </form>
                <div>
                    ALREADY REGISTERED? <Link to="/login">CLICK HERE TO LOGIN</Link>
                </div>
            </div>
        );
    }

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { firstName, lastName, userName, password } = this.state;
        this.setState({
            isLoggin: true,
        })
        const { register } = this.props;
        register(firstName, lastName, userName, password);
    }
}

const mapDispatchToProps = {
    register: registerAction,
}

const mapStateToProps = (state: State) => {
    return {
        isLoggedIn: state.isLoggedIn
    };
}

export const Register = connect(mapStateToProps, mapDispatchToProps)(_Register);