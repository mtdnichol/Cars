import axios from "axios";
import { setAlert } from "./alert";

import {
    GET_USER_POSTS,
    POST_ERROR
} from "./types";

// Get all posts by a user
export const getUserPosts = () => async dispatch => {
    try {
        //@todo Figure out how to post req params to axios to retrieve data subset from backend
        const res = await axios.get('/api/posts/user/')

        dispatch({
            type: GET_USER_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}