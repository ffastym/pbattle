/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import Button from '@material-ui/core/Button/index'
import MenuItem from '@material-ui/core/MenuItem/index'
import React, { Fragment, useState, useRef, useEffect } from 'react'
import TextField from '@material-ui/core/TextField/index'
import PropTypes from 'prop-types'
import url from '../../config/url'
import validator from '../../api/formValidator'
import { Redirect, withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import userActions from '../../actions/userActions'
import { connect } from 'react-redux'

/**
 * Registration component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const Registration = ({ signIn, isLoggedIn, userId }) => {
  const { t } = useTranslation()
  const form = useRef(null)
  const fieldsRef = {
    name: useRef(null),
    surname: useRef(null),
    gender: useRef(null),
    email: useRef(null),
    password: useRef(null),
    repeatPass: useRef(null)
  }
  /** States */
  const [gender, setGender] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState({
    name: '',
    surname: '',
    email: '',
    gender: '',
    password: '',
    repeatPassword: ''
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
     * Change password
     *
     * @param e
     */
  const changePassword = e => {
    validate(e)
    let repeatedPass = fieldsRef.repeatPass.current.value

    if (repeatedPass && repeatedPass !== e.target.value) {
      setError(prevState => ({ ...prevState, repeatPassword: 'passIsNotSame' }))
    } else {
      setError(prevState => ({ ...prevState, repeatPassword: '' }))
    }
  }

  /**
     * Check gender field changes
     *
     * @param e
     */
  const changeGender = e => {
    setGender(e.target.value)
    setError(prevState => ({ ...prevState, gender: '' }))
  }

  /**
     * Check repeated passwors
     *
     * @param e
     */
  const changeRepeatPass = e => {
    if (e.target.value !== fieldsRef.password.current.value) {
      setError(prevState => ({ ...prevState, repeatPassword: 'passIsNotSame' }))
    } else {
      setError(prevState => ({ ...prevState, repeatPassword: '' }))
    }
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

  /**
     * Submit form handler
     */
  const submitForm = () => {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
    let userData = {}
    let isValid = validator.validateForm(form.current, addErr)

    setIsValid(isValid)

    if (!isValid) {
      return
    }

    for (let key in fieldsRef) {
      userData[key] = fieldsRef[key].current.value
    }

    delete userData.repeatPass

    axios.post(serverApiPath + '/api/signUp', userData)
      .then(({ data }) => {
        const err = data.err

        setIsValid(!!err)

        if (data._id) {
          signIn(data)
        }

        if (typeof err === 'object') {
          err.forEach((val) => {
            let errObj = {}

            errObj[val] = 'fieldCantBeEmpty'
            setError(prevState => ({ ...prevState, ...errObj }))
          })
        } else if (err === 'emailExist') {
          setError(prevState => ({ ...prevState, email: 'userWithSuchEmailExist' }))
        } else if (err === 'registrationErr') {
          console.log(t('registrationErr'))
        }
      })
  }

  if (isLoggedIn) {
    return <Redirect to={url.profile + '/' + userId}/>
  }

  return (
    <Fragment>
      <div className="login-title page-title">{t('signUpForAdvantages')}</div>
      <div className="registration-wrapper" ref={form}>
        <TextField type="text"
          name="name"
          error={!!error.name}
          onChange={validate}
          className="field text-input-wrapper"
          inputProps={{
            className: 'text-input validate',
            'data-validate': ['entry'],
            'data-target': 'name',
            ref: fieldsRef.name
          }}
          required
          helperText={t(error.name)}
          label={<label htmlFor="name">{t('Name')}</label>}
          variant='outlined'/>
        <TextField type="text"
          name="surName"
          required
          error={!!error.surname}
          onChange={validate}
          helperText={t(error.surname)}
          className="field text-input-wrapper"
          inputProps={{
            className: 'text-input validate',
            ref: fieldsRef.surname,
            'data-validate': ['entry'],
            'data-target': 'surname'
          }}
          label={<label htmlFor="surName">{t('Surname')}</label>}
          variant='outlined'/>
        <TextField name="gender"
          select
          error={!!error.gender}
          label={<label htmlFor="gender">{t('Gender')}</label>}
          className="field text-input-wrapper"
          inputProps={{
            className: 'text-input validate',
            ref: fieldsRef.gender,
            'class': 'validate',
            'data-validate': ['entry'],
            'data-target': 'gender'
          }}
          required
          value={gender}
          onChange={changeGender}
          helperText={t(error.gender)}
          variant="outlined">
          <MenuItem value="male">{t('male')}</MenuItem>
          <MenuItem value="female">{t('female')}</MenuItem>
        </TextField>
        <TextField type="email"
          name="email"
          error={!!error.email}
          onChange={validate}
          className="field text-input-wrapper"
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
          error={!!error.password}
          helperText={t(error.password)}
          onChange={changePassword}
          className="field text-input-wrapper"
          inputProps={{
            className: 'text-input validate',
            ref: fieldsRef.password,
            'data-validate': ['entry', 'password'],
            'data-target': 'password'
          }}
          required
          label={<label htmlFor="password">{t('Password')}</label>}
          variant='outlined'/>
        <TextField type="password"
          name="repeatPassword"
          onChange={changeRepeatPass}
          error={!!error.repeatPassword}
          className="field text-input-wrapper"
          inputProps={{
            className: 'text-input validate',
            ref: fieldsRef.repeatPass,
            'data-validate': ['entry'],
            'data-target': 'repeatPassword'
          }}
          required
          helperText={t(error.repeatPassword)}
          label={<label htmlFor="repeatPassword">{t('RepeatPassword')}</label>}
          variant='outlined'/>
        <Button href=''
          onClick={submitForm}
          className="primary"
          disabled={!isValid}
          variant={'contained'}>
          {t('signUp')}
        </Button>
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userId: state.user.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
         * Set user as logged in
         *
         * @param userData
         */
    signIn: (userData) => {
      dispatch(userActions.signIn(userData))
    }
  }
}

Registration.propTypes = {
  signIn: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  userId: PropTypes.string
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Registration))
