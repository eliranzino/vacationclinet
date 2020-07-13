import React, { FormEvent } from 'react';
import { connect } from 'react-redux';
import { createVacationAction } from '../../actions';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from 'react-bootstrap';
import "./CreateVacation.css";
import { Link } from 'react-router-dom';


interface CreateVacationsProps {
    createVacation(description: string, destination: string, picture: string, departure: string, returnAt: string, price: number): void;
}

interface CreateVacationsState {
    description: string;
    destination: string;
    picture: string;
    departure: string;
    returnAt: string;
    price: number;
}

class _CreateVacation extends React.Component<CreateVacationsProps, CreateVacationsState> {
    state: CreateVacationsState = {
        description: '',
        destination: '',
        picture: '',
        departure: '',
        returnAt: '',
        price: 0,
    }
    render() {
        const { description, destination, picture, departure, returnAt, price } = this.state;

        return (
            <div className='createVacation'>
                <div>
                    <Link to="/vacations">Go back</Link>
                </div>
                <form onSubmit={this.onSubmit} >
                    <h4>Add new vacation:</h4>
                    <label>Description: </label>
                    {' '}
                    <input value={description} onChange={this.handleInputChange} required name="description"
                        placeholder="Write here the description..." />
                    <label>Destination: </label>
                    {' '}
                    <input value={destination} onChange={this.handleInputChange} required name="destination"
                        placeholder="Write here the destination..." />
                    <label>Departure: </label>
                    {' '}
                    <input value={departure} onChange={this.handleInputChange} required name="departure" type='date' />
                    <label>Return at: </label>
                    {' '}
                    <input value={returnAt} onChange={this.handleInputChange} required name="returnAt" type='date' />
                    <label>Price: </label>
                    {' '}
                    <input value={price} onChange={this.handleInputChange} required name="price" type='number' min='0' />
                    <br />
                    <label>Picture: </label>
                    {' '}
                    <input value={picture} onChange={this.handleInputChange} required name="picture"
                        placeholder="Put here the pic adress..." />
                    <br />
                    <Button className='saveBtn' type="submit" >SAVE</Button>
                </form>
            </div>
        )
    }

    handleInputChange = (e: any) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { description, destination, picture, departure, returnAt, price } = this.state;
        const newDateDeparture = new Date(departure);
        const departureMiliseconds = newDateDeparture.getTime();

        const newDateReturnAt = new Date(returnAt)
        const returnAtMiliSeconds = newDateReturnAt.getTime();

        if (returnAtMiliSeconds < departureMiliseconds) {
            alert('Please note, departure date needs to be before the return flight.');
            return;
        };

        if (! /^https/.test(picture)) {
            alert('URL must start with https.');
            return;
        }

        const { createVacation } = this.props;
        createVacation(description, destination, picture, departure, returnAt, price);
        alert('New vacation created! go back to vacations and see it!');
    }
}

const mapDispatchToProps = {
    createVacation: createVacationAction,
}

export const CreateVacation = connect(null, mapDispatchToProps)(_CreateVacation);