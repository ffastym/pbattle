/**
 * @author Yuriy Matviyuk
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import GoogleLogin from 'react-google-login'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login'
import user from '../../api/axios/user'
import userActions from '../../actions/userActions'
import notifyActions from '../../actions/notifyActions'

/**
 * SocialLogin component
 *
 * @param signIn
 * @param setNotify
 *
 * @returns {*}
 * @constructor
 */
const SocialLogin = ({ signIn, setNotify }) => {
  const [nameObj, setNameObj] = useState(null)

  /**
   * Facebook login response handler
   *
   * @param response
   */
  const responseFacebook = (response) => {
    logIntoAccount({
      email: response.id,
      password: response.id,
      name: getNameObj(response.name).name,
      surname: getNameObj(response.name).surname,
      isSocial: true
    })
  }

  /**
   * Get separated name and surname (Need for Facebook login)
   *
   * @param fullName
   *
   * @returns {{surname: *, name: *}|unknown}
   */
  const getNameObj = (fullName) => {
    if (nameObj) {
      return nameObj
    }

    let arr = fullName.split(' ')
    let obj = {
      name: arr[0],
      surname: arr[1]
    }

    setNameObj(obj)

    return obj
  }

  /**
   * Google login response handler
   *
   * @param response
   */
  const responseGoogle = (response) => {
    logIntoAccount({
      email: response.googleId,
      password: response.accessToken,
      name: response.profileObj.givenName,
      surname: response.profileObj.familyName,
      isSocial: true
    })
  }

  const logIntoAccount = usr => {
    user.signUp(usr).then(({ data }) => {
      if (data._id) {
        signIn(data)
        setNotify('signInSuccess', 'success')
      }
    }).catch(() => {
      setNotify('logInError', 'error')
    })
  }

  return (
    <div className='social-login'>
      <FacebookLogin
        appId="749123112209386"
        textButton=''
        cssClass='social-login-btn btn-fb'
        icon='fa-facebook'
        fields="name,picture"
        callback={responseFacebook} />
      <GoogleLogin
        clientId="755429385215-p5dd71bgfjggsov95katv8k29j79ot4b.apps.googleusercontent.com"
        buttonText=""
        className='social-login-btn btn-google'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    /**
     * Set user as logged in
     *
     * @param userData
     */
    signIn: (userData) => {
      dispatch(userActions.signIn(userData))
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

SocialLogin.propTypes = {
  signIn: PropTypes.func,
  setNotify: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin)
