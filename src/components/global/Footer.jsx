/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import url from '../../config/url'
import { NavLink, Redirect } from 'react-router-dom'
import battleActions from '../../actions/battleActions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

/**
 * Footer component
 *
 * @param setNewPhotom
 * @param battlePhoto
 * @returns {*}
 * @constructor
 */
const Footer = ({ setNewPhoto, battlePhoto }) => {
  const createBattle = e => {
    const files = e.target.files

    if (!files.length) {
      return
    }

    setNewPhoto(files[0])
  }

  return (
    <footer className="footer">
      {!!battlePhoto && <Redirect to={url.newBattle}/>}
      <div className="actions-panel">
        <NavLink exact to={url.home} className="action home"/>
        <NavLink to={url.notifications} className="action notifications"/>
        <label className="action add-photo" htmlFor='new_battle_photo'>
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
    battlePhoto: state.battle.newPhoto
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
    }
  }
}

Footer.propTypes = {
  setNewPhoto: PropTypes.func,
  battlePhoto: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
