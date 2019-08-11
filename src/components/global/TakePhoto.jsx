/**
 * @author Yuriy Matviyuk
 */
import battleActions from '../../actions/battleActions'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import url from '../../config/url'
import Webcam from 'react-webcam'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import userActions from '../../actions/userActions'

/**
 * TakePhoto component
 *
 * @param setBattlePhoto
 * @param photo string
 * @param photo avatar
 * @param photo userId
 * @param photo setProfilePhoto
 * @returns {*}
 * @constructor
 */
const TakePhoto = ({ setNewPhoto, photo, avatar, userId, setProfilePhoto }) => {
  const webcam = useRef(null)
  const wrapper = useRef(null)
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [facingMode, setMode] = useState('user')
  const redirectUrl = !avatar ? url.profile + userId : url.newBattle

  useEffect(() => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
  }, [])

  let captureBtnClassName = photo
    ? 'photo-action button capture'
    : 'photo-action button capture active'

  /**
     * Capture photo
     */
  const capture = () => {
    let newPhoto = ''

    if (!photo) {
      newPhoto = webcam.current.getScreenshot()
    }

    avatar ? setNewPhoto(newPhoto) : setProfilePhoto({ temp: newPhoto })
  }

  /**
     * Close webcam
     */
  const switchWebcam = () => {
    setMode(facingMode === 'user' ? { exact: 'environment' } : 'user')
  }

  /**
     * Render TakePhoto component
     */
  return (
    <div className='new-photo-wrapper' ref={wrapper}>
      {photo ? <img className="photo-preview" id='user_photo' src={photo} alt=""/>
        : <Webcam className="webcam"
          audio={false}
          height='auto'
          ref={webcam}
          screenshotFormat="image/jpeg"
          width='auto'
          screenshotQuality={1}
          style={{ height: '100vh', width: '100vw' }}
          videoConstraints={{ height, width, facingMode }}
        />}
      <div className="photo-toolbar">
        {photo
          ? <NavLink to={redirectUrl} className='action photo-action button save active'/>
          : <span className='action photo-action button save' onClick={switchWebcam}/>}
        <span className={captureBtnClassName} onClick={capture}/>
        <NavLink to={url.home} className="photo-action action home"/>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    photo: state.battle.newPhoto,
    avatar: state.user.avatar,
    userId: state.user.id
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
     * Set New profile photo
     *
     * @param photo
     */
    setProfilePhoto: photo => {
      dispatch(userActions.setProfilePhoto(photo))
    }
  }
}

TakePhoto.propTypes = {
  setNewPhoto: PropTypes.func,
  setProfilePhoto: PropTypes.func,
  photo: PropTypes.string,
  userId: PropTypes.string,
  avatar: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(TakePhoto)
