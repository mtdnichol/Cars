import axios from "axios";

// Takes a token, if token is there, add to header, otherwise delete from headers
// Tokens are sent with each request
const setAuthToken = token => {
    if (token) // If token exists, set it in the header
        axios.defaults.headers.common['x-auth-token'] = token
    else // Delete from global headers
        delete axios.defaults.headers.common['x-auth-token']
}

export default setAuthToken