/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import React, {Fragment, useState} from 'react'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import LogIn from './LogIn'
import popUpActions from "../../actions/popUpActions"
import userActions from "../../actions/userActions"
import Button from "@material-ui/core/Button";

/**
 * Header component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const Header = (props) => {
    const [isOpenLogin, openLogin] = useState(false);

    let menuClassName = props.isNavActive
            ? 'action menu active'
            : 'action menu';

    return (
        <header id='header' className="header">
            <div className="header-content">
                <NavLink exact={true} to='/' className='logo'>
                    <img src="/logo.png" alt="Photobattle"/>
                </NavLink>
                <div className='actions-toolbar'>
                    {props.isLoggedIn
                        ? <NavLink to={'/profile/' + props.userId} className='action account'/>
                        : <Fragment>
                            <span onClick={() => openLogin(true)} id="login" className="action account"/>
                            <LogIn isOpen={isOpenLogin} openLogin={openLogin}/>
                        </Fragment>
                    }
                    <span className={menuClassName}
                          onClick={props.toggleMenu}
                          title='show menu'>
                </span>
                </div>
            </div>
        </header>
    )
};

const mapStateToProps = (state) => {
    return {
        isMobile    : state.app.isMobile,
        isNavActive : state.app.isNavActive,
        isLoggedIn  : state.user.isLoggedIn,
        userId      : state.user.id
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Toggle menu
         */
        toggleMenu: () => {
            dispatch(appActions.toggleMenu())
        },

        /**
         * LogOut
         */
        logOut: () => {
            dispatch(popUpActions.showPopUp('LOGOUT'));
            dispatch(userActions.logOut())
        },

        /**
         * Login
         */
        logIn: () => {
            dispatch(popUpActions.showPopUp('LOGIN'));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
