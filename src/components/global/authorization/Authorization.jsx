/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {connect} from "react-redux"
import userActions from "../../../actions/userActions"
import Button from '@material-ui/core/Button/index'
import SignIn from './SignIn'
import Registration from '../Registration'
import axios from "axios/index";
import {Trans} from "react-i18next/src/index";

/**
 * Authorization component
 */
class Authorization extends Component {
    /**
     * Authorization Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            email: null,
            password: null,
            repeatedPass: null,
            passError: false,
            repeatPassError: false,
            type: null
        }
    }

    /**
     * Render Authorization component
     */
    render() {
        const type = this.state.type;

        return (
            <div className="page-content">
                {!type ?
                    <div className="authorize-type-wrapper">
                        <Button href=''
                                variant="contained"
                                onClick={() => this.setState({type: 'signIn'})}
                                className='authorize-button'>
                            <Trans>existingUser</Trans>
                        </Button>
                        <Button href=''
                                variant="contained"
                                onClick={() => this.setState({type: 'signUp'})}
                                className='authorize-button'>
                            <Trans>newUser</Trans>
                        </Button>
                    </div>
                    : type === 'signIn' ? <SignIn/> : <Registration/>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set user as logged in
         *
         * @param data
         */
        login: (data) => {
            dispatch(userActions.login(data))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Authorization)
