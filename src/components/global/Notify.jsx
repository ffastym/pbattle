/**
 * @author Yuriy Matviyuk
 */
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Notify component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Notify = ({ type, setNotify, message }) => {
  let color = ''
  const { t } = useTranslation()

  switch (type) {
    case 'error':
      color = 'red'
      break
    default:
      color = 'green'
  }

  /**
     * Hide snackbar
     */
  const hide = () => {
    setNotify('')
  }

  return (
    <Snackbar open={true} autoHideDuration={2000} onClose={hide}>
      <SnackbarContent message={t(message)} style={{ background: color }}/>
    </Snackbar>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.notify.message,
    type: state.notify.type
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
         * Set message of material UI snackbar (success login message)
         *
         * @param message
         * @param type
         */
    setNotify: (message, type) => {
      dispatch(notifyActions.setMessage(message, type))
    }
  }
}

Notify.propTypes = {
  type: PropTypes.string,
  setNotify: PropTypes.func,
  message: PropTypes.string
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notify))
