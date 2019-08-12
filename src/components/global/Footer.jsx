/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import url from '../../config/url'
import { NavLink, Redirect } from 'react-router-dom'
import battleActions from '../../actions/battleActions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import appActions from '../../actions/appActions'

/**
 * Footer component
 *
 * @param setNewPhotom
 * @param battlePhoto
 * @param isLoggedIn
 * @param openLogin
 *
 * @returns {*}
 * @constructor
 */
const Footer = ({ setNewPhoto, battlePhoto, isLoggedIn, openLogin }) => {
  const createBattle = e => {
    const files = e.target.files

    if (!files.length) {
      return
    }

    setNewPhoto(files[0])
  }

  const checkIsLoggedIn = (e) => {
    if (isLoggedIn) {
      return
    }

    e.preventDefault()
    openLogin()
  }

  return (
    <footer className="footer">
      {!!battlePhoto && <Redirect to={url.newBattle}/>}
      <div className="actions-panel">
        <NavLink exact to={url.home} className="action home"/>
        <NavLink to={url.notifications} className="action notifications"/>
        <label className="action add-photo" htmlFor='new_battle_photo' onClick={checkIsLoggedIn}>
          <input id='new_battle_photo' type='file' accept='image/*' onChange={createBattle}/>
        </label>
        <NavLink to={url.myBattles} className="action battles"/>
        <NavLink to={url.rating} className="action rating"/>
      </div>
    </footer>
  )
}

const mapStateToProps = state => {
  return {
    battlePhoto: state.battle.newPhoto,
    isLoggedIn: state.user.isLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    /**
     * Set photo for new battle
     *
     * @param photo
     */
    setNewPhoto: (photo) => {
      dispatch(battleActions.setNewPhoto(photo))
    },

    /**
     * Show login popin
     */
    openLogin: () => {
      dispatch(appActions.openLogin(true))
    }
  }
}

Footer.propTypes = {
  openLogin: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  setNewPhoto: PropTypes.func,
  battlePhoto: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
