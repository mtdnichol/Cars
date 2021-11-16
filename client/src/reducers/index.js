import { combineReducers } from "redux";

import alert from './alert'
import auth from './auth'

// Must add any reducers
export default combineReducers({
    alert,
    auth
})