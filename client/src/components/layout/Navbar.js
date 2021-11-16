import React, {Fragment} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authHome = (
        <h1>
            <Link to={'/feed'}> <i className="fas fa-car"></i> Cars</Link>
        </h1>
    )

    const guestHome = (
        <h1>
            <Link to={'/'}> <i className="fas fa-car"></i> Cars</Link>
        </h1>
    )


    const authLinks = (
        <ul>
            <li> <Link to={'/feed'}>Feed</Link> </li>
            <li> <Link to={'/profile'}>Profile</Link> </li>
            <li> <Link onClick={ logout } to={'/'}><i className='fas fa-sign-out-alt'></i>{' '}<span className='hide-sm'>Logout</span></Link></li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li> <Link to={'/login'}>Login</Link> </li>
            <li> <Link to={'/register'}>Register</Link> </li>
        </ul>
    )

    // Check if the user is loading from the database, if they are not loading anymore check for authentication.  If auth, user is logged in and display authLinks, otherwise guestLinks
    return (
        <nav className="navbar bg-dark">

            { !loading && (<Fragment>{ isAuthenticated ? authHome : guestHome}</Fragment>)}
            { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)