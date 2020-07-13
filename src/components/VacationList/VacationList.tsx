import React from 'react';
import { IVacation } from '../../models/vacation';
import { IUser } from '../../models/user';
import { Vacation } from '../Vacation/Vacation';
import { State } from '../../store';
import { connect } from 'react-redux';
import { GetVacationsAction, connectSocketAction } from '../../actions';
import './VacationList.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';



const links = [
    {
        to: '/charts',
        title: 'Charts',
    },
    {
        to: '/createVacation',
        title: 'Create vacation',
    },
];

interface VacationListProps {
    vacations: IVacation[];
    getVacations(): void;
    connect():void;
    isLoading: boolean;
    isLoggedIn: boolean;
    followedVacationsOfUser: any;
    userActive: IUser;
}

class _VacationList extends React.Component<VacationListProps> {

    render() {
        const { isLoading, vacations, followedVacationsOfUser, userActive } = this.props;
        console.log("userActive", userActive)
        if (isLoading) {
            return <Loader type="Circles" color="#00BFFF" height={80} width={80} />
        }

        return (
            <div >
                {userActive.isAdmin ?
                    <div>
                        <ul>
                            {links.map(link =>
                                <li key={link.to}>
                                    <Link to={link.to}>{link.title}</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    : null}
                    {!userActive.isAdmin ? <h5>Start follow your favorite vacations!</h5> : null}
                {vacations.map((vacation, i) =>
                    <div key={i} className='theVacation'>
                        <Vacation key={vacation.ID} {...vacation} follow={followedVacationsOfUser.some((vac: any) => vac.vacationId === vacation.ID ? true : false)} />
                    </div>
                )}
            </div>
        );
    }
    componentDidMount() {
        console.log('componentDidMount')
        const { getVacations, isLoggedIn, connect } = this.props;
        if (isLoggedIn) {
            getVacations();
            connect();
        }
    }
}


const mapStateToProps = (state: State) => ({
    vacations: state.vacations,
    isLoading: state.isGettingVacations,
    isLoggedIn: state.isLoggedIn,
    followedVacationsOfUser: state.followedVacations,
    userActive: state.userActive,
});

const mapDispatchToProps = {
    getVacations: GetVacationsAction,
    connect: connectSocketAction,
}

export const VacationList = connect(mapStateToProps, mapDispatchToProps)(_VacationList);
