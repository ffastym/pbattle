/**
 * @author Yuriy Matviyuk
 */
import detectFace from '../../api/faceDetector'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import battleActions from '../../actions/battleActions'

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
  const [errText, setErrText] = useState('')
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
    if (!photo) {
      setNewPhoto(webcam.current.getScreenshot())

      return detectFace('user_photo').then(face => {
        if (!face) {
          // TODO setErrText('Обличчя не розпізнано')
        }
      }).catch(err => console.log('err ---> ', err))
    }

    setNewPhoto(null)

    if (errText) {
      setErrText('')
    }
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
        {photo && !errText
          ? <NavLink to='/new_battle' className='action photo-action button save active'/>
          : <span className='action photo-action button save' onClick={switchWebcam}/>}
        <span className={captureBtnClassName} onClick={capture}/>
        <NavLink to="/" className="photo-action action home"/>
      </div>
      {errText && <span>{errText}</span>}
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
