/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import PropTypes from 'prop-types'
import React  from 'react'
import url from '../../config/url'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

/**
 * Header component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const Header = (props) => {
  let menuClassName = props.isNavActive
    ? 'action menu active'
    : 'action menu'

  return (
    <header id='header' className="header">
      <div className="header-content">
        <NavLink exact={true} to={url.home} className='logo'>
          <img src="/logo.png" alt="Photobattle"/>
        </NavLink>
        <div className='actions-panel'>
          {props.isLoggedIn
            ? <NavLink to={url.profile + props.userId} className='action account'/>
            : <span onClick={props.openLogin} id="login" className="action account"/>
          }
          <span className={menuClassName}
            onClick={props.toggleMenu}
            title='show menu'>
          </span>
        </div>
      </div>
    </header>
  )
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.app.isMobile,
    isNavActive: state.app.isNavActive,
    isLoggedIn: state.user.isLoggedIn,
    userId: state.user.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
    * Toggle menu
    */
    toggleMenu: () => {
      dispatch(appActions.toggleMenu())
    },

    /**
     * Show login popin
     */
    openLogin: () => {
      dispatch(appActions.openLogin(true))
    }
  }
}

Header.propTypes = {
  isNavActive: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  userId: PropTypes.string,
  openLogin: PropTypes.func,
  toggleMenu: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
