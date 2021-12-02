import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import {Link} from "react-router-dom";
import Spinner from "../layout/Spinner";

const Profile = ({ getCurrentProfile, auth, profile: { profile } }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [])

    // @todo Separate profile fragments into fragments, and use fragments to construct profile.
    return (
        <section className="container">
            {profile === null ? (<Spinner />) : (
                <Fragment>
                    <div>
                        {auth.isAuthenticated &&
                        auth.loading === false &&
                        auth.user.id === profile.user.id && (
                            <Link to="/profile/edit" className="btn btn-dark">
                                Edit Profile
                            </Link>
                        )}
                    </div>
                </Fragment>
            )}
        </section>
    )
}

Profile.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Profile)