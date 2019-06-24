/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

/**
 * Profile component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Profile = (props) => {
    const isEditabe = props.match.params.user_id === props.userId;

    return (
        <div>
            {isEditabe ? 'editable' : 'static'}
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        userId : state.user.id
    }
};

export default withRouter(connect(mapStateToProps)(Profile))
