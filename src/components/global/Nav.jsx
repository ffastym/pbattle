/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

/**
 * Nav component
 *
 * @param isNavActive
 * @param toggleMenu
 * @returns {*}
 * @constructor
 */
const Nav = ({ isNavActive, toggleMenu }) => {
  return (
    <nav className={isNavActive ? 'menu active' : 'menu'}>
      <NavLink className="nav-link" exact onClick={toggleMenu} to='/'>Головна</NavLink>
      <NavLink className="nav-link" onClick={toggleMenu} to='/contact_us'>Написати Нам</NavLink>
      <NavLink className="nav-link" onClick={toggleMenu} to='/privacy_policy'>Політика <br/> Конфіденційності</NavLink>
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
         * Toggle menu
         */
    toggleMenu: () => {
      dispatch(appActions.toggleMenu())
    }
  }
}

Nav.propTypes = {
  isNavActive: PropTypes.bool,
  toggleMenu: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
