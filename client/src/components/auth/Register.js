import React, { useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import { connect } from 'react-redux'
import { setAlert } from "../../actions/alert";
import PropTypes from 'prop-types'

const Register = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData // Pulls fields from formData

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value }) // When you type in a input, it updates the state.  Otherwise cannot type in boxes

    const onSubmit = async (e) => { // Validation that the users passwords were entered correctly
        e.preventDefault();
        if (password !== password2)
            setAlert('Passwords do not match', 'danger') // Calls actions/alert
        else {
            console.log('SUCCESS')
        }
    }

    return (
        <section className="container">
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
                <i className="fas fa-user" /> Create Your Account
            </p>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image, use a
                        Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={onChange}
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
    setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert })(Register)