import { getState, getDispatch } from ".";
//import { IVacation } from "./models/vacation";
import { Actions } from "./store";

export function socketActions(){
    const {socket} = getState();
    const dispatch = getDispatch();

    socket?.on('ADDED_NEW_VACATION', ({newVacation}: any)=>{
        dispatch({
            type: Actions.AddedNewVacation ,
            payload: {
                newVacation,
            },
        });
    })
};

