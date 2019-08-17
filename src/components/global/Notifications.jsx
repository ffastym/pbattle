/**
 * @author Yuriy Matviyuk
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * Notifications component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
const Notifications = (props) => {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])

  return (
    <div className='notifications-wrapper'>
      {notifications.length
        ? notifications
        : <div className="empty">{t('noNotifications')}</div>}
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

Notifications.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
