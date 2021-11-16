import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'), // Gets token from the users local storage
    isAuthenticated: null, // Initial response is null, but set to true when user is authenticated
    loading: true, // Make sure that when a user is authenticated, ensure the loading is done from the backend.  True is not loaded, false is loaded
    user: null // When the request to api/auth is completed, users mongodb results will be loaded
}

export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case USER_LOADED:
            return { ...state, isAuthenticated: true, loading: false, user: payload }
        case REGISTER_SUCCESS: // Token is received
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return { ...state, ...payload, isAuthenticated: true, loading: false}
        case REGISTER_FAIL: // Clears the entire auth state, and token from localStorage
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token') // Remove the token on a failed login
            return { ...state, token: null, isAuthenticated: false, loading: false}
        default:
            return state
    }
}