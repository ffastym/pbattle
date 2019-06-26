/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import detectFace from '../../api/faceDetector'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { connect } from 'react-redux'

/**
 * TakePhoto component
 *
 * @param switchWebcam
 * @returns {*}
 * @constructor
 */
const TakePhoto = ({ switchWebcam }) => {
  const webcam = useRef(null)
  const [img, setImg] = useState(null)
  const [errText, setErrText] = useState('')
  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: 'user'
  }

  let captureBtnClassName = img ? 'button capture' : 'button capture active'
  let saveBtnClassName = img && !errText ? 'button save-photo active' : 'button save-photo'

  /**
     * Capture photo
     */
  const capture = () => {
    if (!img) {
      setImg(webcam.current.getScreenshot())

      return detectFace('user_photo').then(face => {
        if (!face) {
          setErrText('Обличчя не розпізнано')
        }
      }).catch(err => console.log('err ---> ', err))
    }

    setImg(null)

    if (errText) {
      setErrText('')
    }
  }

  /**
     * Close webcam
     */
  const closeWebcam = () => {
    if (img && !errText) {
      console.log('test ---> ', 'save')
    }

    switchWebcam()
  }

  /**
     * Render TakePhoto component
     */
  return (
    <div>
      {img ? <img className="photo-preview" id='user_photo' src={img} alt=""/>
        : <Webcam className="webcam"
          audio={false}
          height={500}
          ref={webcam}
          screenshotFormat="image/jpeg"
          width={414}
          screenshotQuality={1}
          videoConstraints={videoConstraints}
        />}
      <button className={captureBtnClassName}
        onClick={capture}>Capture photo</button>
      <button className={saveBtnClassName}
        onClick={closeWebcam}>Save photo</button>
      {errText && <span>{errText}</span>}
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
         * Switch webcam
         */
    switchWebcam: () => {
      dispatch(appActions.switchWebcam())
    }
  }
}

TakePhoto.propTypes = {
  switchWebcam: PropTypes.func
}

export default connect(() => { return {} }, mapDispatchToProps)(TakePhoto)
