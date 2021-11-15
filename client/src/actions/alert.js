import {v4 as uuid} from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from "./types";


export const setAlert = (msg, alertType, timeout = 3000) => dispatch => { // Timeout default is 5s
    const id = uuid() // Generate a uuid for the alert
    dispatch({ // Sent to client
        type: SET_ALERT,
        payload: { msg, alertType, id}
    })

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout) // Removes the alert after the timeout period concludes
}