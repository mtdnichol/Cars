import React, {useState} from "react";
import {Link} from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData // Pulls fields from formData

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value }) // When you type in a input, it updates the state.  Otherwise cannot type in boxes

    const onSubmit = async (e) => { // Validation that the users passwords were entered correctly
        e.preventDefault();
        console.log('SUCCESS')
    }

    return (
        <section className="container">
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead">
                <i className="fas fa-user" /> Sign Into Your Account
            </p>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
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
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </section>
    )
}

export default Login