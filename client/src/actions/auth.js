import axios from "axios";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from "./types";
import {setAlert} from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
    if (localStorage.token)
            setAuthToken(localStorage.token)

    try {
        const res = await axios.get('/api/auth') // If everything returns ok, dispatch userloaded

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// Register
export const register = ({ name, email, password }) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password })

    try {
        const res = await axios.post('/api/users', body, config) // Make a call to the backend with axios to create a new user

        dispatch({ // If successful, respond with a successful register and the users data
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors // Check to see if the backend responded with specific errors

        if (errors)
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) // Create an alert and post to the client, timeout set at 5000

        dispatch({ // If unsuccessful, respond with a fail
            type: REGISTER_FAIL
        })
    }
}

// Login User
export const login = ({ email, password }) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password })

    try {
        const res = await axios.post('/api/auth', body, config) // Make a call to the backend with axios to login a user

        dispatch({ // If successful, respond with a successful login and the users data
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors // Check to see if the backend responded with specific errors

        if (errors)
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) // Create an alert and post to the client, timeout set at 5000

        dispatch({ // If unsuccessful, respond with a fail
            type: LOGIN_FAIL
        })
    }
}

// Logout / Clear Profile
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: LOGOUT })
}
