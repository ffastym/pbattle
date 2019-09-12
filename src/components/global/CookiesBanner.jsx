/**
 * @author Yuriy Matviyuk
 */
import React, { useEffect } from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import appActions from '../../actions/appActions'
import PropTypes from 'prop-types'
import url from '../../config/url'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'
import localStorageHelper from '../../api/localStorageHelper'

/**
 * CookiesBanner component
 *
 * @returns {*}
 * @constructor
 */
const CookiesBanner = ({ acceptCookies, isAcceptCookies }) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!isAcceptCookies && localStorageHelper.getLocalStorage().getItem('acceptCookies')) {
      acceptCookies()
    }
  })

  return (
    <div className='cookies-banner'>
      <p>
        Для ведення аналітики відвідування додатку та розміщення корректної реклами ми використовуємо
        файли cookies, а також записуємо дані про сесію до локального сховища Вашого браузера.
        Натискаючи на кнопку нижче ви підтверджуєте, що погоджуєтеся з даними умовами та з
        умовами нашої <NavLink to={url.privacyPolicy}>Політики конфіденційності</NavLink>
      </p>
      <Button href=''
        onClick={acceptCookies}
        className="primary"
        variant={'contained'}>
        {t('accept')}
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isAcceptCookies: state.app.isAcceptCookies
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
     * Accept Cookies
     */
    acceptCookies: () => {
      dispatch(appActions.acceptCookies())
    }
  }
}

CookiesBanner.propTypes = {
  acceptCookies: PropTypes.func,
  isAcceptCookies: PropTypes.bool
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CookiesBanner))
