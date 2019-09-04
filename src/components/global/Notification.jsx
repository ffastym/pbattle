/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import cloudinary from '../../api/cloudinary'
import { Image, Transformation } from 'cloudinary-react'
import { NavLink } from 'react-router-dom'
import userActions from '../../actions/userActions'
import { connect } from 'react-redux'
import user from '../../api/axios/user'
import store from '../../store'

/**
 * Notification component
 *
 * @param data
 * @param setNotifications
 * @param notifications
 *
 * @returns {*}
 * @constructor
 */
const Notification = ({ data, setNotifications, notifications }) => {
  const { t } = useTranslation()

  const removeNotification = () => {
    user.removeNotification({
      notificationId: data._id,
      userId: store.getState().user.id
    }).then(() => {
      setNotifications(notifications.filter(notification => notification._id !== data._id))
    })
  }

  return (
    <div className="notification" onClick={removeNotification}>
      <NavLink to={data.action} className='content'>
        <Image cloudName={cloudinary.cloudName} publicId={data.image}>
          <Transformation height="60" fetchFormat="auto" width="45" gravity='face' crop="fill" />
        </Image>
        <div className="details">
          <div className="notification-title">{t(data.title)}</div>
          <div className="notification-text">{t(data.body.message).replace('%1', data.body['%1'])}</div>
        </div>
      </NavLink>
      <div className="action close"/>
    </div>
  )
}

Notification.propTypes = {
  data: PropTypes.object,
  setNotifications: PropTypes.func,
  notifications: PropTypes.array
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNotifications: data => {
      return dispatch(userActions.setNotifications(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
