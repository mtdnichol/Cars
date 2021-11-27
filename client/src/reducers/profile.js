import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "../actions/types";

const initialState = {
    profile: null, // Hold all profile data on login, or if visiting another profile, load other profile in here
    profiles: [], // List of profiles
    loading: true, // Once a request is made, set to false
    error: {} // Any errors on request
}

function profileReducer (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                loading: false
            }
        default:
            return state
    }
}

export default profileReducer