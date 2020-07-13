import React, { FormEvent } from 'react';
import { connect } from 'react-redux';
import './Vacation.css';
import { Card } from 'react-bootstrap';
import { State } from '../../store';
import { toggleFollowAction, deleteAction, updateVacationFieldsAction } from '../../actions';
import { IUser } from '../../models/user';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';


interface VacationProps {
    deleteVacation(ID: number): void;
    toggleFollow(ID: number): void;
    updateVacationFields(ID: number, description: string, destination: string, picture: string, departure: Date, returnAt: Date, price: number): void;
    ID: number;
    description: string;
    destination: string;
    picture: string;
    departure: Date;
    returnAt: Date;
    price: number;
    users: IUser[];
    follow: boolean;
    userActive: IUser;
}
interface VacationState extends VacationProps {
    isEdit: boolean;
    tempDescription: string;
    tempDestination: string;
    tempPicture: string;
    tempPrice: number;
    tempDeparture: Date;
    tempReturnat: Date;
    show: boolean;
}

class _Vacation extends React.Component<VacationProps, VacationState> {

    constructor(vacationProps: VacationProps) {
        super(vacationProps);

        const { description, destination, picture, departure, returnAt, price, follow, userActive, deleteVacation, toggleFollow, updateVacationFields, users, ID } = vacationProps;

        this.state = {
            show: false, isEdit: false, description, destination, picture, departure, returnAt, price, follow, userActive, deleteVacation, toggleFollow, updateVacationFields, users, ID, tempDescription: description, tempDeparture: departure, tempReturnat: returnAt, tempDestination: destination, tempPicture: picture, tempPrice: price
        };
    };

    render() {
        const { isEdit, show } = this.state;
        return (
            <div className="vacation">
                <Card style={{ width: '18rem', height: '22rem' }}>
                    {!this.state.userActive.isAdmin ?
                        this.state.follow ? <label className="switch"> <input type="checkbox" defaultChecked className="checkbox" onClick={this.handlePut} /><span className="slider round"></span></label> :
                            <label className="switch"><input type="checkbox" className="isComplete" onClick={this.handlePut} /><span className="slider round"></span></label>
                        : <> <Button variant="danger" className="deleteButton" onClick={this.handleDelete} >X</Button>
                            <Button onClick={this.handleEdit} className='editButton'>🖋</Button> </>
                    }

                    <Card.Img variant="top" src={this.state.picture} />
                    <Card.Body style={{ padding: '0px' }}>
                        <Card.Title>{this.state.description}</Card.Title>
                        <Card.Text >
                            <br />
                            {this.state.destination}
                            <br />
                            {moment(this.state.departure).format("MMMM Do YYYY")} - 
                            <br />
                            {moment(this.state.returnAt).format("MMMM Do YYYY")}
                            <br />
                            Price: ₪{this.state.price}
                        </Card.Text>
                    </Card.Body>
                </Card>
                {isEdit ?
                    <Modal show={show} onHide={this.handleCloseModal}>
                        <Modal.Header>
                            <Modal.Title>Edit:</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.onSubmit}>
                            <p>Description: </p>
                            {' '}
                            <input value={this.state.description} onChange={this.handleInputChange} required name="description"
                                placeholder="Write here the description..." />
                            <p>Destination: </p>
                            {' '}
                            <input value={this.state.destination} onChange={this.handleInputChange} required name="destination"
                                placeholder="Write here the destination..." />
                            <br />
                            <p>Departure: </p>
                            {' '}
                            <input onChange={this.handleInputChange} name="departure" type='date' />
                            <p>Return: </p>
                            {' '}
                            <input onChange={this.handleInputChange} name="returnAt" type='date' />
                            <p>Price: </p>
                            {' '}
                            <input onChange={this.handleInputChange} value={this.state.price} required name="price" type='number' />
                            <p>Picture: </p>
                            {' '}
                            <input onChange={this.handleInputChange} value={this.state.picture} required name="picture"
                                placeholder="Put here the pic adress..." />
                            <br />
                        </form>

                        <Modal.Footer>
                            <Button className='closeModal' onClick={this.handleCloseModal} variant="secondary">Close</Button>
                            <Button onClick={this.onSubmit} type='submit' variant="primary">Edit Fields</Button>
                        </Modal.Footer>
                    </Modal>
                    : null
                }
            </div>
        )
    }


    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('ON SUBMIT');
        const { updateVacationFields, ID } = this.props;
        const { description, destination, picture, departure, returnAt, price } = this.state;
        console.log({ ID, description, destination, picture, departure, returnAt, price });
        updateVacationFields(ID, description, destination, picture, departure, returnAt, Number(price));
        this.setState({
            isEdit: false
        })
    }
    handleInputChange = (e: any) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }
    handleDelete = () => {
        const { deleteVacation, ID } = this.props;
        console.log("in vacation compo the id is", ID)
        deleteVacation(ID);
    }
    handleEdit = () => {
        this.setState({
            isEdit: true,
            show: true,
        })
    }
    handleCloseModal = () => {
        const { tempDescription, tempPrice, tempPicture, tempDestination, tempReturnat, tempDeparture } = this.state;
        this.setState({
            isEdit: false,
            show: false,
            description: tempDescription,
            destination: tempDestination,
            price: tempPrice,
            departure: tempDeparture,
            returnAt: tempReturnat,
            picture: tempPicture,
        })
    }

    handlePut = () => {
        const { ID, toggleFollow } = this.props;
        toggleFollow(ID);
    }
}

const mapDispatchToProps = {
    toggleFollow: toggleFollowAction,
    deleteVacation: deleteAction,
    updateVacationFields: updateVacationFieldsAction,
}

const mapStateToProps = (state: State) => ({
    users: state.users,
    userActive: state.userActive,
});

export const Vacation = connect(mapStateToProps, mapDispatchToProps)(_Vacation);