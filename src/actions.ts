import { Actions, Action } from "./store";
import { Dispatch } from "redux";
import axios from 'axios';
import { IVacation } from "./models/vacation";
import { IUser } from "./models/user";
import { RegisterResult } from "./models/registerResult";
import { LoginResult } from "./models/loginResult";
import { Delete } from "./models/delete";
import { getToken, saveToken, clearToken } from "./token";
import io from 'socket.io-client';
import { socketActions } from "./socket";


const SERVER_URL = 'http://localhost:3001';


export const loginAction = (userName: string, password: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const { data: result } = await axios.post<LoginResult>(`${SERVER_URL}/users/login`, {
                userName,
                password,
            });
            console.log(userName, password)
            console.log({ result })
            if (result.success) {
                saveToken(result.token);
                dispatch({
                    type: Actions.Login,
                    payload: {
                        msg: result.msg,
                        userNameId: result.userNameId,
                        userActive: result.userActive,
                    }
                });
            }
            console.log('this is the token, im in LOGIN action', result.token)
        } catch{
            dispatch({
                type: Actions.LoginFail,
                payload: {
                    msg: 'user name or password are incorrect!'
                }
            });

        }
    }
}
export const GetVacationsAction = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.GetVacationsPending,
            payload: {},
        });
        try {
            const response = await axios.get<any>(`${SERVER_URL}/vacations`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            const { vacations } = response.data;

            const { followedVacationsOfUser, userActive, vacationsInTheOrderOfFollow, vacationNames, followersAmountForChart } = response.data;
            console.log({ vacations, followedVacationsOfUser })
            dispatch({
                type: Actions.GetVacationsSuccess,
                payload: {
                    vacations,
                    followedVacationsOfUser,
                    userActive,
                    vacationsInTheOrderOfFollow,
                    vacationNames,
                    followersAmountForChart
                }
            });
        }
        catch {
            dispatch({
                type: Actions.GetVacationsFail,
                payload: {},
            });
            console.log("you couldnt get the vacations")
        }
    }
}

export const GetFavoriteVacationsAction = (userId: number) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.GetVacationsPending,
            payload: {},
        });
        try {
            const response = await axios.get<IVacation[]>(`${SERVER_URL}/vacations/${userId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            const json = response.data;
            console.log({ json })
            dispatch({
                type: Actions.GetFavoriteVacationsSuccess,
                payload: {
                    json,
                }
            });
        }
        catch {
            dispatch({
                type: Actions.GetVacationsFail,
                payload: {},
            });
            console.log("you couldnt get the vacations")
        }
    }
}
//
export const GetUsersAction = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.GetUsersPending,
            payload: {},
        });
        try {
            const response = await axios.get<IUser[]>(`${SERVER_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            const users = response.data;
            console.log("im in action and here are the users:", users)
            dispatch({
                type: Actions.GetUsersSuccess,
                payload: {
                    users,
                }
            });
        }
        catch {
            dispatch({
                type: Actions.GetUsersFail,
                payload: {},
            });
            console.log("you couldnt get the users")
        }
    }
}
export const createVacationAction = (description: string, destination: string, picture: string, departure: string, returnAt: string, price: number) => {
    const vacationDetails = { description, destination, picture, departure, returnAt, price }
    return async (dispatch: Dispatch<Action>) => {
        try {
            console.log('sending new vacation: ', vacationDetails);
            await axios({
                method: 'post',
                url: `${SERVER_URL}/vacations`,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(vacationDetails)
            }).then(function (response) {
                console.log('this is what i get from post', response.data);
            });
            // dispatch({
            //     type: Actions.CreateVacation,
            //     payload: {
            //         newVacation: content.data,
            //     }
            // });
        }
        catch {
            dispatch({
                type: Actions.PostVacationsFail,
                payload: {},
            });
        }
    }
}

export const signOutAction = () => {
    clearToken();
    return {
        type: Actions.SignOut,
        payload: {
            msg: ""
        }
    }
}

export const registerAction = (firstName: string, lastName: string, userName: string, password: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const { data: result } = await axios.post<RegisterResult>(`${SERVER_URL}/users/register`, {
                firstName,
                lastName,
                userName,
                password,
            });

            if (result.success) {
                saveToken(result.token);
                dispatch({
                    type: Actions.Register,
                    payload: {
                        msg: result.msg,
                        userActive: result.userActive,
                    }
                });
            }
        }
        catch (err) {
            if (err.response) {
                dispatch({
                    type: Actions.RegisterFail,
                    payload: {
                        msg: "User already exists"
                    }
                });

            }
        }
    }
}

export const deleteAction = (ID: number) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const { data } = await axios.delete<Delete>(`${SERVER_URL}/vacations/${ID}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            console.log('this is the data in payload when i delete:', data, 'and the id is;', data.id)
            // dispatch({
            //     type: Actions.DeleteVacation,
            //     payload: {
            //         ID: data.id
            //     }
            // });
        }
        catch {
            dispatch({
                type: Actions.DeleteVacationFail,
                payload: {},
            });
        }

    }
}

export const updateVacationFieldsAction = (vacationId: number, description: string, destination: string, picture: string, departure: Date, returnAt: Date, price: number) => {
    console.log({ description, destination, picture, departure, returnAt, price });
    console.log({ departure, returnAt });

    const newDateDeparture = new Date(departure)
    const departureMiliSeconds = newDateDeparture.getTime();
    console.log({ departureMiliSeconds })

    const newDateReturnAt = new Date(returnAt)
    const returnAtMiliSeconds = newDateReturnAt.getTime();

    const newDetails = { description, destination, picture, departure: departureMiliSeconds, returnAt: returnAtMiliSeconds, price };
    return async (dispatch: Dispatch<Action>) => {
        try {
            axios({
                method: 'put',
                url: `${SERVER_URL}/vacations/${vacationId}`,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(newDetails)
            })//.then((content)=>{
            //     dispatch({
            //         type: Actions.UpdateFields,
            //         payload: {
            //             msg: content,
            //         }
            //     });
            // }) 
        }
        catch {
            dispatch({
                type: Actions.UpdateFieldsFail,
                payload: {},
            });
        }

    }
}

export const toggleFollowAction = (ID: number) => {
    return async (dispatch: Dispatch<Action>) => {
        axios({
            method: 'post',
            url: `${SERVER_URL}/vacations/${ID}/toggleFollow`,
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            },
        }).then((content) => {
            console.log("this is the content-", content)
            console.log("this is the content.data-", content.data)
            // dispatch({
            //     type: Actions.FollowVacation,
            //     payload: {
            //         result: content.data
            //     }
            // });

        })

    }
}



// export function connectAction() {
//     console.log('you in connectAction')
//     return (dispatch: Dispatch<Action>) => {
//         const ws = new WebSocket('ws://localhost:3001');
//         ws.addEventListener('open', () => {
//             console.log('connect to WS');
//             dispatch({
//                 type: Actions.Connect,
//                 payload: {
//                     ws,
//                 }
//             });
//         });

//         ws.addEventListener('message', ({ data }) => {
//             const action = JSON.parse(data);
//             dispatch(action);
//         })
//     }
// }

export function connectSocketAction() {
    return (dispatch: Dispatch<Action>) => {
        const socket = io.connect(SERVER_URL);

        socket.on('connect', () => {
            socket
                .emit('authenticate', { token: getToken() })
                .on('authenticated', () => {
                    dispatch({
                        type: Actions.Connect,
                        payload: {
                            socket,
                        },
                    });
                    socketActions();
                })
                .on('unauthorized', (msg:string)=>{
                    console.log(`unauthorized: ${JSON.stringify(msg)}`);
                    throw new Error(msg);
                })
        });
    }
}

// function sendRequestAction(request: any) {
//     return (dispatch: Dispatch<Action>, getState: any) => {
//         const { ws } = getState();
//         console.log({ ws })
//         ws.send(JSON.stringify(request));
//     }
// } 