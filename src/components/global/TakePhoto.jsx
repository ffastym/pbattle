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

/**
 * TakePhoto component
 *
 * @param setBattlePhoto
 * @param photo string
 * @returns {*}
 * @constructor
 */
const TakePhoto = ({ setNewPhoto, photo }) => {
  const webcam = useRef(null)
  const wrapper = useRef(null)
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [facingMode, setMode] = useState('user')

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

    setNewPhoto(newPhoto)
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
          height={height}
          ref={webcam}
          screenshotFormat="image/jpeg"
          width={width}
          screenshotQuality={1}
          videoConstraints={{ height, width, facingMode }}
        />}
      <div className="photo-toolbar">
        {photo
          ? <NavLink to={url.newBattle} className='action photo-action button save active'/>
          : <span className='action photo-action button save' onClick={switchWebcam}/>}
        <span className={captureBtnClassName} onClick={capture}/>
        <NavLink to={url.home} className="photo-action action home"/>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    photo: state.battle.newPhoto
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

TakePhoto.propTypes = {
  setNewPhoto: PropTypes.func,
  photo: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(TakePhoto)
