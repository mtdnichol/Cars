import { GET_PROFILE, PROFILE_ERROR } from "../actions/types";

const initialState = {
    profile: null, // Hold all profile data on login, or if visiting another profile, load other profile in here
    profiles: [], // List of profiles
    loading: true, // Once a request is made, set to false
    error: {} // Any errors on request
}

export default function (state = initialState, action) {
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
        default:
            return state
    }
}