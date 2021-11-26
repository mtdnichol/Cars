import axios from "axios";
import { setAlert } from "./alert";

import {
    GET_PROFILE,
    PROFILE_ERROR
} from "./types";

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Update a profile
// History: redirect after you submit the form to redirect to a client side route
// FormData: All the information the user posts when they change their profile
export const updateProfile = (formData, navigate) => async dispatch => {
    try {
        const res = await axios.post('/api/profile', formData)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Profile Updated', 'success'))

        navigate('/profile')
    } catch (err) {
        // const errors = err.response.data.errors // Check to see if the backend responded with specific errors
        //
        // if (errors)
        //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) // Create an alert and post to the client, timeout set at 5000

        console.log(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}