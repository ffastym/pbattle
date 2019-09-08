/**
 * @author Yuriy Matviyuk
 */
import userRequest from '../../api/axios/user'
import cloudinary from '../../api/cloudinary'
import Editable from './Editable'
import Loader from '../global/Loader'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

/**
 * Profile component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
const Profile = (props) => {
  const { t } = useTranslation()
  const userId = props.match.params.user_id
  const isEditabe = userId === props.userId
  const [user, setUser] = useState(null)

  if (isEditabe) {
    return <Editable/>
  }

  if (!user) {
    userRequest.getUserProfile(userId).then(({ data }) => {
      if (!data || !data._id) {
        return setUser('not found')
      }

      setUser(data)
    }).catch(() => {
      return <div>{t('cantLoadUserProfile')}</div>
    })

    return <Loader/>
  }

  if (user === 'not found') {
    return <div>{t('userProfileNotFound')}</div>
  }

  return (
    <div className='user-profile'>
      <div className="profile-photo-wrapper">
        <div className="profile-photo">
          <Image cloudName={cloudinary.cloudName} publicId={user.avatar}>
            <Transformation height="200" fetchFormat="auto" width="150" gravity='face' crop="fill" />
          </Image>
        </div>
      </div>
      <h1 className="name">{user.name + ' ' + user.surname}</h1>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.id
  }
}

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user_id: PropTypes.string.isRequired
    })
  }),
  userId: PropTypes.string
}

export default withRouter(connect(mapStateToProps)(Profile))
