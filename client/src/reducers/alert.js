import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = []

// Action requires type and payload (data)
function alertReducer (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case SET_ALERT: // Set alert adds a alert to the array of alerts displayed to the user.  Pushes to the top of the page
            return [...state, payload]
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload) // Removes an alert given its uuid
        default:
            return state
    }
}

export default alertReducer