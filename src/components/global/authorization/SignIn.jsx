/**
 * @author Yuriy Matviyuk
 */
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import userActions from '../../../actions/userActions'
import { connect } from 'react-redux'

/**
 * SignIn component
 *
 * @returns {*}
 * @constructor
 */
const SignIn = () => {
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className="login-title">{t('signInForAdvantages')}</div>
      <div className="log-in-wrapper">

      </div>
    </Fragment>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
         * Set user as logged in
         *
         * @param data
         */
    logIn: (data) => {
      dispatch(userActions.login(data))
    }
  }
}

export default connect(() => { return {} }, mapDispatchToProps)(SignIn)
