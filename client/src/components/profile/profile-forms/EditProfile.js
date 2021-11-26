import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateProfile } from '../../../actions/profile'
import mapStateToProps from "react-redux/lib/connect/mapStateToProps";


const EditProfile = ({ updateProfile }) => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ // Profile fields with default values
        location: '',
        bio: '',
        organization: '',
        youtube: '',
        twitter: '',
        facebook: '',
        instagram: '',
    })

    const { // Pull all the fields from the form data
        location,
        bio,
        organization,
        youtube,
        twitter,
        facebook,
        instagram
    } = formData

    // When a input is changed, set the formdata variable for that input name to the value inside the input on each change
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value})

    const onSubmit = e => {
        e.preventDefault()
        updateProfile(formData, navigate)
    }

    return (
        <section className='container'>
            <h1 className='large'>Edit Your Profile</h1>

            <form className='form' onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input type='text' placeholder='Location' name='location' value={location} onChange={e => onChange(e)}/>
                    <small className='form-text'>Where are you located?  May help connecting with other enthusiasts in your area</small>
                </div>

                <div className='form-group'>
                    <textarea placeholder='Bio' name='bio' value={bio} onChange={e => onChange(e)}></textarea>
                    <small className='form-text'>Description about you and your cars</small>
                </div>

                <div className='form-group'>
                    <input type='text' placeholder='Organization' name='organization' value={organization} onChange={e => onChange(e)}/>
                    <small className='form-text'>Organization you identify with (if any)</small>
                </div>

                <div className='form-group social-input'>
                    <i className='fab fa-instagram fa-2x'></i>
                    <input type='text' placeholder='Instagram URL' name='instagram' value={instagram} onChange={e => onChange(e)}/>
                </div>
                <div className='form-group social-input'>
                    <i className='fab fa-youtube fa-2x'></i>
                    <input type='text' placeholder='YouTube URL' name='youtube' value={youtube} onChange={e => onChange(e)}/>
                </div>
                <div className='form-group social-input'>
                    <i className='fab fa-facebook fa-2x'></i>
                    <input type='text' placeholder='Facebook URL' name='facebook' value={facebook} onChange={e => onChange(e)}/>
                </div>
                <div className='form-group social-input'>
                    <i className='fab fa-twitter fa-2x'></i>
                    <input type='text' placeholder='Twitter URL' name='twitter' value={twitter} onChange={e => onChange(e)}/>
                </div>

                <input type='submit' className='btn btn-primary my-1'/>
            </form>
        </section>
    )
}

EditProfile.propTypes = {
    updateProfile: PropTypes.func.isRequired
}

// If you are using history, must wrap component with 'withRouter'
export default connect(null, { updateProfile })(EditProfile)