import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePassword } from "../../../actions/profile";
import { setAlert } from "../../../actions/alert";

const ChangePassword = ({ setAlert }) => {
    const [formData, setFormData] = useState(
        {
            passwordOld: '',
            passwordNew: '',
            passwordNewVerify: ''
        }
    );
    const navigate = useNavigate()

    const { // Pull all the fields from the form data
        passwordOld,
        passwordNew,
        passwordNewVerify
    } = formData

    // When a input is changed, set the formdata variable for that input name to the value inside the input on each change
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value})

    const onSubmit = async e => {
        e.preventDefault()
        if (passwordNew !== passwordNewVerify)
            setAlert('Passwords do not match', 'danger')
        else
            changePassword(formData, navigate)
    }

    return (
        <section className='container'>

            <div className='wrapper'>
                <div className='sidebar'>
                    <ul>
                        <li className='sidebar-selected'><Link to='/profile/edit'>Edit Profile</Link></li>
                        <li><Link to=''><b>Change Password</b></Link></li>
                        <li><Link to=''>Preferences</Link></li>
                        <li><Link to=''>Account</Link></li>
                    </ul>
                </div>
                <div className='content'>
                    <h1 className='large'>Change Your Password</h1>

                    <form className='form' onSubmit={ onSubmit }>
                        <div className='form-group'>
                            <h3>Old Password</h3>
                            <input type='password' placeholder='Old Password' name='passwordOld' onChange={e => onChange(e)}/>
                        </div>

                        <div className='form-group'>
                            <h3>New Password</h3>
                            <input type='password' placeholder='New Password' name='passwordNew' onChange={e => onChange(e)}/>
                        </div>

                        <div className='form-group'>
                            <h3>New Password Verify</h3>
                            <input type='password' placeholder='Retype New Password' name='passwordNewVerify' onChange={e => onChange(e)}/>
                        </div>

                        <input type='submit' className='btn btn-primary my-1'/>
                        <Link className='btn btn-light my-1' to='/profile'>Go Back</Link>
                    </form>
                </div>
            </div>

        </section>
    )
}

ChangePassword.propTypes = {
    setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert })(ChangePassword)