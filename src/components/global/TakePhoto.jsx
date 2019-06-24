/**
 * @author Yuriy Matviyuk
 */
import React, {useRef, useState} from 'react'
import Webcam from 'react-webcam'
import {connect} from 'react-redux'
import appActions from '../../actions/appActions'
import detectFace from '../../api/faceDetector'

/**
 * TakePhoto component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const TakePhoto = (props) => {
    const webcam = useRef(null),
          [img, setImg] = useState(null),
          [errText, setErrText] = useState(''),
          videoConstraints = {
              width: 720,
              height: 1280,
              facingMode: "user"
          };

    let captureBtnClassName = img ? 'button capture' : 'button capture active',
        saveBtnClassName = img && !errText ? 'button save-photo active' : 'button save-photo';

    /**
     * Capture photo
     */
    const capture = () => {
        if (!img) {
            setImg(webcam.current.getScreenshot());

            return detectFace('user_photo').then(face => {
                if (!face) {
                    setErrText('Обличчя не розпізнано')
                }
            }).catch(err => console.log('err ---> ', err))
        }

        setImg(null);

        if (errText) {
            setErrText('')
        }
    };

    /**
     * Close webcam
     */
    const closeWebcam = () => {
        if (img && !errText) {
            console.log('test ---> ', 'save');
        }
        
        props.switchWebcam()
    };

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
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Switch webcam
         */
        switchWebcam: () => {
            dispatch(appActions.switchWebcam())
        }
    }
};

export default connect(() => {return {}}, mapDispatchToProps)(TakePhoto)
