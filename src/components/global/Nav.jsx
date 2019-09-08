/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import url from '../../config/url'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

/**
 * Nav component
 *
 * @param isNavActive
 * @param closeMenu
 * @returns {*}
 * @constructor
 */
const Nav = ({ isNavActive, closeMenu }) => {
  return (
    <nav className={isNavActive ? 'nav active' : 'nav'}>
      <NavLink className="nav-link"
        exact
        onClick={closeMenu}
        to={url.home}>
        Головна
      </NavLink>
      {/*<NavLink className="nav-link"
        onClick={closeMenu} to={url.contactUs}>
        Написати Нам
      </NavLink>
      <NavLink className="nav-link"
        onClick={closeMenu}
        to={url.privacyPolicy}>
        Політика <br/> Конфіденційності
      </NavLink>*/}
    </nav>
  )
}

const mapStateToProps = (state) => {
  return {
    isNavActive: state.app.isNavActive
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
     * Close menu
     */
    closeMenu: () => {
      dispatch(appActions.toggleMenu(false))
    }
  }
}

Nav.propTypes = {
  isNavActive: PropTypes.bool,
  closeMenu: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
