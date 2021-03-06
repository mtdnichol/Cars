import React, { useState } from "react";
import {Link, Navigate } from "react-router-dom";
import { connect } from 'react-redux'
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from 'prop-types'

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_verify: ''
    })

    const { name, email, password, password_verify } = formData // Pulls fields from formData

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value }) // When you type in a input, it updates the state.  Otherwise cannot type in boxes

    const onSubmit = async (e) => { // Validation that the users passwords were entered correctly
        e.preventDefault();
        if (password !== password_verify)
            setAlert('Passwords do not match', 'danger') // Calls actions/alert to display an alert to the user
        else {
            return register({ name, email, password }) // Pushes to actions/auth to create the account
        }
    }

    // Redirect if logged in
    if (isAuthenticated)
        return <Navigate to='/feed' />

    return (
        <section className="container">
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
                <i className="fas fa-user" /> Create Your Account
            </p>
            <form className="form" onSubmit={ onSubmit }>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        id="name"
                        name="name"
                        value={name}
                        onChange={ onChange }
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        id="email"
                        name="email"
                        value={email}
                        onChange={ onChange }
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={ onChange }
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        id="password_verify"
                        name="password_verify"
                        value={password_verify}
                        onChange={ onChange }
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </section>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register)