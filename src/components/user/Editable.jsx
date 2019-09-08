/**
 * @author Yuriy Matviyuk
 */
import Button from '@material-ui/core/Button'
import cloudinary from '../../api/cloudinary'
import Loader from '../global/Loader'
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import user from '../../api/axios/user'
import userActions from '../../actions/userActions'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

/**
 * Editable component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Editable = (props) => {
  const { t } = useTranslation()
  const [isUploadProcessed, setIsUploadProcessed] = useState(false)
  const profilePhoto = props.avatar

  const changePhoto = (e) => {
    const files = e.target.files

    if (!files.length) {
      return
    }

    setIsUploadProcessed(true)
    cloudinary.upload(files[0]).end((err, response) => {
      const photo = response.body.public_id

      if (err) {
        props.setNotify('imageUploadingError', 'error')
      } else if (photo) {
        user.setAvatar({ photo, id: props.userId }).then(() => {
          props.setAvatar(photo)
          props.setNotify('photoChangedSuccessfully', 'success')
          setIsUploadProcessed(false)
        }).catch(() => {
          props.setNotify('imageUploadingError', 'error')
          setIsUploadProcessed(false)
        })
      }
    })
  }

  return (
    <div className='user-profile'>
      <div className="profile-photo-wrapper">
        <div className="profile-photo">
          <label className='action edit' htmlFor='profile_photo'>
            <input id='profile_photo' type='file' accept='image/*' onChange={changePhoto}/>
          </label>
          {isUploadProcessed
            ? <Loader/>
            : profilePhoto
              ? <Image cloudName={cloudinary.cloudName} publicId={profilePhoto}>
                <Transformation height="200" fetchFormat="auto" width="150" gravity='face' crop="fill" />
              </Image>
              : <img src='/images/profile.png' alt='profile'/> }
        </div>
      </div>
      <h1 className="name">{props.name + ' ' + props.surname}</h1>
      <Button href=''
        onClick={props.logOut}
        className="primary"
        variant={'text'}>
        {t('logOut')}
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    avatar: state.user.avatar,
    name: state.user.name,
    surname: state.user.surname,
    gender: state.user.gender,
    age: state.user.age,
    country: state.user.country,
    city: state.user.city
  }
}

const mapDispatchToProps = dispatch => {
  return {
    /**
     * log out from account
     *
     * @returns {*}
     */
    logOut: () => {
      return dispatch(userActions.logOut())
    },

    /**
     * Set user profile photo
     *
     * @param photo
     */
    setAvatar: photo => {
      dispatch(userActions.setAvatar(photo))
    },

    /**
     * Set message of material UI snackbar
     *
     * @param message
     * @param type
     */
    setNotify: (message, type) => {
      dispatch(notifyActions.setMessage(message, type))
    }
  }
}

Editable.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user_id: PropTypes.string.isRequired
    })
  }),
  userId: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  surname: PropTypes.string,
  gender: PropTypes.string,
  age: PropTypes.number,
  setNotify: PropTypes.func,
  setAvatar: PropTypes.func,
  country: PropTypes.string,
  city: PropTypes.string,
  logOut: PropTypes.func
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Editable))
