import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { IUser } from './models/user';
import { IVacation } from './models/vacation';
import { Socket } from 'socket.io-client';

export interface State {
    socket: typeof Socket | null;
    isLoggedIn: boolean;
    user: IUser | null;
    isGettingVacations: boolean;
    isGettingUsers: boolean;
    vacations: IVacation[];
    favoriteVacations: any;
    users: IUser[];
    message: string;
    whoLoggedIn: number;
    followedVacations: any;
    userActive: any;
    vacationNames: string[];
    followersAmountForChart: number[];
}

const isLoggedIn = !!localStorage.getItem('token');

const initialState: State = {
    socket: null,
    isLoggedIn,
    user: null,
    isGettingVacations: false,
    isGettingUsers: false,
    vacations: [],
    users: [],
    message: "",
    favoriteVacations: [],
    whoLoggedIn: 0,
    followedVacations: [],
    userActive: {},
    vacationNames: [],
    followersAmountForChart:[],
}

export interface Action {
    type: string;
    payload: Record<string, any>;
}

export enum Actions {
    Connect = 'CONNECT',
    Login = 'LOGIN',
    Register = 'REGISTER',
    SignOut = 'SIGN_OUT',
    GetVacationsPending = 'GET_VACATIONS_PENDING',
    GetUsersPending = 'GET_USERS_PENDING',
    GetVacationsSuccess = 'GET_VACATIONS_SUCCESS',
    GetUsersSuccess = 'GET_USERS_SUCCESS',
    GetVacationsFail = 'GET_VACATIONS_FAIL',
    GetUsersFail = 'GET_USERS_FAIL',
    PostVacationsFail = 'POST_VACATIONS_FAIL',
    FollowVacation = 'FOLLOW_VACATION',
    LoginFail = 'LOGIN_FAIL,',
    RegisterFail = 'REGISTER_FAIL',
    GetFavoriteVacationsSuccess = 'GET_FAVORITE_VACATIONS_SUCCESS',
    DeleteVacationFail = 'DELETE_VACATION_FAIL',
    UpdatedFields = 'UPDATED_FIELDS',
    UpdateFieldsFail = 'UPDATE_FIELD_FAIL',
    AddedNewVacation = 'ADDED_NEW_VACATION',
    DeletedVacation = 'DELETED_VACATION_WS',

}

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case Actions.Register: {
            const { msg, userActive } = action.payload;
            console.log({ msg })
            return {
                ...state,
                isLoggedIn: true,
                message: msg,
                userActive: userActive,
            }
        }
        case Actions.Connect: {
            const { socket } = action.payload;
            return {
                ...state,
                socket,
            }
        }
        case Actions.DeletedVacation: {
            console.log("WS")
            const { vacations } = state;
            const modifiedVacations = vacations.slice();
            const { id } = action.payload;
            console.log("in store and the id to delete is ", id)
            const cellIndexToDelete = vacations.findIndex(vacation => vacation.ID.toString() === id);
            console.log('cellIndexToDelete:', cellIndexToDelete);
            const newArray = modifiedVacations.splice(cellIndexToDelete, 1);
            console.log('newArray:',newArray);
            console.log('modifiedVacations:', modifiedVacations);
            return {
                ...state,
                isGettingVacations: false,
                vacations: modifiedVacations,
            }
        }
        case Actions.UpdatedFields: {
            console.log("you in store updatedFields");
            const { vacations } = state;
            const { msg, data } = action.payload;
            const modifiedVacations = vacations.slice();
            console.log({ modifiedVacations, msg });
            console.log(data);
            const cellIndexToUpdate = vacations.findIndex(vacation => vacation.ID === data.ID);
            console.log({ cellIndexToUpdate });
            modifiedVacations[cellIndexToUpdate] = data;
            console.log({ modifiedVacations });
            return {
                ...state,
                message: msg,
                isGettingVacations: false,
                vacations: modifiedVacations,
            }
        }
        case Actions.Login: {
            const { msg, userNameId, userActive } = action.payload;
            console.log({ userActive })
            return {
                ...state,
                isGettingVacations: false,
                isLoggedIn: true,
                message: msg+userActive.firstName,
                whoLoggedIn: userNameId,
                userActive,
            }
        }
        case Actions.SignOut: {
            const { msg } = action.payload;
            state.socket?.disconnect();
            return {
                ...state,
                vacations: [],
                favoriteVacations: [],
                isLoggedIn: false,
                message: msg,
            }
        }

        case Actions.GetVacationsPending: {
            return {
                ...state,
                isGettingVacations: true,
            }
        }
        case Actions.GetUsersPending: {
            return {
                ...state,
                isGettingUsers: true,
            }
        }

        case Actions.GetVacationsFail: {
            return {
                ...state,
                isGettingVacations: false,
            }
        }
        case Actions.GetUsersFail: {
            return {
                ...state,
                isGettingUsers: false,
            }
        }
        case Actions.PostVacationsFail: {
            return {
                ...state,
                isGettingVacations: false,
            }
        }
        case Actions.DeleteVacationFail: {
            return {
                ...state,
                isGettingVacations: false,
            }
        }
        case Actions.LoginFail: {
            const { msg } = action.payload;
            return {
                ...state,
                message: msg
            }
        }
        case Actions.RegisterFail: {
            const { msg } = action.payload;
            return {
                ...state,
                message: msg
            }
        }
        case Actions.FollowVacation: {
            const { vacations } = state;
            const { vacationId, userId, msg } = action.payload;
            console.log('{ vacationId, userId, msg }', vacationId, userId, msg )
            const modifiedVacations = vacations.slice();
            console.log({vacations})
            const cellIndexUpdate = modifiedVacations.findIndex(vacation => vacation.ID === vacationId);
            const followUnfollowVacation = modifiedVacations.find(vacation => vacation.ID === vacationId);
            // console.log({ json })
            // console.log({ cellIndexUpdate });
            // console.log({ followUnfollowVacation });
            //@ts-ignore
            modifiedVacations[cellIndexUpdate] = followUnfollowVacation;
            console.log({modifiedVacations})
            return {
                ...state,
                vacations: modifiedVacations,
                message: msg,
            }
        }
        case Actions.GetFavoriteVacationsSuccess: {
            const { favoriteVacations } = state;
            const modifiedFavoriteVacations = favoriteVacations.concat();
            const { json } = action.payload;
            json.map((itm: any) => (
                [itm.vacation].map((str: any) => (
                    modifiedFavoriteVacations.push(JSON.parse(str)[0])
                ))
            ))
            return {
                ...state,
                isGettingVacations: false,
                favoriteVacations: modifiedFavoriteVacations,
            }
        }
        case Actions.GetVacationsSuccess: {
            const { followedVacationsOfUser, userActive, vacationsInTheOrderOfFollow, vacationNames, followersAmountForChart } = action.payload;
            console.log({ followedVacationsOfUser, vacationsInTheOrderOfFollow, followersAmountForChart });
            console.log({vacationNames})
            const vNames = vacationNames.map((a:any) => a.destination);
            const fAmount = followersAmountForChart.map((a:any)=> a.followersAmount);
            console.log({fAmount})

        
            return {
                ...state,
                isGettingVacations: false,
                vacations: vacationsInTheOrderOfFollow,
                followedVacations: followedVacationsOfUser,
                userActive,
                vacationNames: vNames,
                followersAmountForChart: fAmount,
            }
        }
        case Actions.GetUsersSuccess: {
            const { users } = action.payload;
            console.log("this is from the PAYLOAD:", users);
            return {
                ...state,
                isGettingUsers: false,
                users,
            }
        }
        case Actions.AddedNewVacation: {
            console.log("WS suppose to work");
            const { vacations } = state;
            const { newVacation } = action.payload;
            console.log("this is the NEW newVacation", newVacation)
            const modifiedVacations = vacations.concat();
            modifiedVacations.push(newVacation)
            console.log("this is what i got from payload:", newVacation)
            return {
                ...state,
                vacations: modifiedVacations,
            }
        }

        default: {
            return state;
        }
    }
}



export function createReduxStore() {
    const logger = createLogger();
    const middleware = composeWithDevTools(applyMiddleware(thunk, logger));
    return createStore(reducer, middleware);
}