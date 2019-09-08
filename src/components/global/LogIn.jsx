/**
 * @author Yuriy Matviyuk
 */
import user from '../../api/axios/user'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { NavLink } from 'react-router-dom'
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import userActions from '../../actions/userActions'
import url from '../../config/url'
import validator from '../../api/formValidator'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import appActions from '../../actions/appActions'
import SocialLogin from './SocialLogin'
import SetGenderFieldset from '../user/SetGenderFieldset'
/**
 * Log in component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const LogIn = (props) => {
  const { t } = useTranslation()
  const form = useRef(null)
  const noGender = props.gender === 'none'
  const fieldsRef = {
    email: useRef(null),
    password: useRef(null)
  }
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    checkErrors()
  })

  /**
     * Check errors
     */
  const checkErrors = () => {
    let isValid = true

    for (let err in error) {
      if (!error.hasOwnProperty(err)) {
        continue
      }

      if (error[err]) {
        isValid = false
        break
      }
    }

    setIsValid(isValid)
  }

  /**
     * Validate field
     *
     * @param e
     */
  const validate = e => {
    validator.validateField(e.target, setError)
  }

  /**
     * Add error
     *
     * @param type
     * @param message
     */
  const addErr = (type, message) => {
    let errObj = {}

    errObj[type] = message
    setError(prevState => ({ ...prevState, ...errObj }))
  }

  const submitForm = () => {
    let userData = {}
    let isValid = validator.validateForm(form.current, addErr)

    setIsValid(isValid)

    if (!isValid) {
      return false
    }

    for (let key in fieldsRef) {
      userData[key] = fieldsRef[key].current.value
    }

    delete userData.repeatPass

    user.signIn(userData).then(({ data }) => {
      const err = data.err

      setIsValid(!!err)

      if (typeof err === 'object') {
        err.forEach((val) => {
          let errObj = {}

          errObj[val] = 'fieldCantBeEmpty'
          setError(prevState => ({ ...prevState, ...errObj }))
        })
      } else if (err === 'wrongEmailOrPassword') {
        props.setNotify('wrongEmailOrPassword', 'error')
      } else if (err === 'loginErr') {
        props.setNotify('someErrPleaseTryLater', 'error')
      }

      if (data._id) {
        props.hideLogin()
        props.signIn(data)
        props.setNotify('signInSuccess')
      }
    })
  }

  return (
    <Dialog open={props.isOpen} aria-labelledby="login" className="log-in-wrapper">
      <DialogTitle id="simple-dialog-title" style={{ padding: '5px 24px 0' }}>
        {t(noGender ? 'choseYourGender' : 'signInNow')}
        {!noGender && <span className="action close" onClick={props.hideLogin}/>}
      </DialogTitle>
      <DialogContent ref={form}>
        {noGender
          ? <SetGenderFieldset/>
          : <React.Fragment>
            <SocialLogin/>
            <TextField type="email"
              name="email"
              autoFocus
              error={!!error.email}
              className="field text-input-wrapper"
              onChange={validate}
              inputProps={{
                className: 'text-input validate',
                ref: fieldsRef.email,
                'data-validate': ['entry', 'email'],
                'data-target': 'email'
              }}
              required
              helperText={t(error.email)}
              label={<label htmlFor="email">{t('Email')}</label>}
              variant='outlined'/>
            <TextField type="password"
              name="password"
              onChange={validate}
              className="field text-input-wrapper"
              error={!!error.password}
              helperText={t(error.password)}
              inputProps={{
                className: 'text-input validate',
                ref: fieldsRef.password,
                'data-validate': ['entry'],
                'data-target': 'password'
              }}
              required
              label={<label htmlFor="password">{t('Password')}</label>}
              variant='outlined'/>
            <Button href=''
              onClick={submitForm}
              disabled={!isValid}
              className="primary"
              variant={'contained'}>
              {t('logIn')}
            </Button>
            <p className='or'>{t('or')}</p>
            <NavLink to={url.registration} onClick={props.hideLogin} className='register-link'>
              {t('createAccount')}
            </NavLink>
          </React.Fragment>}
      </DialogContent>
    </Dialog>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    gender: state.user.gender,
    isOpen: state.app.isOpenLogin
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
         * Set user as logged in
         *
         * @param userData
         */
    signIn: userData => {
      dispatch(userActions.signIn(userData))
    },

    /**
     * Hide login popin
     */
    hideLogin: () => {
      dispatch(appActions.openLogin(false))
    },

    /**
    * Set message of material UI snackbarredire
    *
    * @param message
    * @param type
    */
    setNotify: (message, type) => {
      dispatch(notifyActions.setMessage(message, type))
    }
  }
}

LogIn.propTypes = {
  setNotify: PropTypes.func,
  hideLogin: PropTypes.func,
  gender: PropTypes.string,
  signIn: PropTypes.func,
  isOpen: PropTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)
