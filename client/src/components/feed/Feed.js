import React, {useEffect} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";

const Feed = ({ getCurrentProfile, auth, profile }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [])

    return (
        <section className="container">
            <div>
                Feed
            </div>
        </section>
    )
}

Feed.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Feed)