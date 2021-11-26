import { GET_USER_POSTS, POST_ERROR } from "../actions/types";

const initialState = {
    post: null, // Hold a single post if requested
    posts: [], // Hold array of posts if requested
    loading: true, // Once a request is made, set to false
    error: {} // Any errors on request
}

export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_USER_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state
    }
}