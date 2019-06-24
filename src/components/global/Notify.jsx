/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import {withRouter} from "react-router-dom";
import notifyActions from "../../actions/notifyActions"
import {connect} from "react-redux";

/**
 * Notify component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Notify = (props) => {
    let color = '';

    switch (props.type) {
        case 'error':
            color = 'red';
            break;
        default:
            color = 'green'
    }

    /**
     * Hide snackbar
     */
    const hide = () => {
        props.setNotify('')
    };

    return (
        <Snackbar open={true} autoHideDuration={2000} onClose={hide}>
            <SnackbarContent message={props.message} style={{background: color}}/>
        </Snackbar>
    )
};

const mapStateToProps = (state) => {
    return {
        message : state.notify.message,
        type    : state.notify.type
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set message of material UI snackbar (success login message)
         *
         * @param message
         * @param type
         */
        setNotify: (message, type) => {
            dispatch(notifyActions.setMessage(message, type))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notify))
