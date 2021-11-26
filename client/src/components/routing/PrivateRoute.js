import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({component: Component, auth: { isAuthenticated, loading }}) => { // Same as App.js, except route is changed to ensure the user is authenticated before accessing a page
    if (loading) return <Spinner />; // If user is loading, display spinner
    if (isAuthenticated) return <Component />; // If user is authenticated, allow them to access requested page
    return <Navigate to="/login" />; // Otherwise, redirect the user back to the login screen
};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);