import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateProfile, getCurrentProfile } from '../../../actions/profile'

// Declared outside as to not trigger a useEffect, can now construct profileData
const initialState = {
    location: '',
    bio: '',
    organization: '',
    youtube: '',
    twitter: '',
    facebook: '',
    instagram: '',
}

const EditProfile = ({ profile: { profile, loading }, updateProfile, getCurrentProfile }) => {
    const [formData, setFormData] = useState(initialState);
    const navigate = useNavigate()

    useEffect(() => {
        if (!profile) getCurrentProfile()

        if (!loading && profile) {
            const profileData = { ...initialState };
            for (const key in profile) {
                if (key in profileData) profileData[key] = profile[key];
            }
            for (const key in profile.social) {
                if (key in profileData) profileData[key] = profile.social[key];
            }
            setFormData(profileData);
        }
        console.log(profile.location)
    }, [loading, getCurrentProfile, profile]) // UseEffect runs when loading is complete

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
                    <h3>Location</h3>
                    <input type='text' placeholder='Location' name='location' value={location} onChange={e => onChange(e)}/>
                    <small className='form-text'>Where are you located?  May help connecting with other enthusiasts in your area</small>
                </div>

                <div className='form-group'>
                    <h3>Bio</h3>
                    <textarea placeholder='Bio' name='bio' value={bio} onChange={e => onChange(e)}></textarea>
                    <small className='form-text'>Description about you and your cars</small>
                </div>

                <div className='form-group'>
                    <h3>Organization</h3>
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
    updateProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

// If you are using history, must wrap component with 'withRouter'
export default connect(mapStateToProps, { updateProfile, getCurrentProfile })(EditProfile)