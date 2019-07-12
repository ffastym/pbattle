/**
 * @author Yuriy Matviyuk
 */
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Editable from './Editable'
import Loader from '../global/Loader'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Image, Transformation } from 'cloudinary-react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

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
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

    axios.post(serverApiPath + '/api/getUserProfile', { userId }).then(({ data }) => {
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

  const address = 'address'

  return (
    <div className='user-profile'>
      <div className="profile-photo-wrapper">
        <Image cloudName={props.cloudName} publicId={user.avatar}>
          <Transformation height="200" fetchFormat="auto" width="150" gravity='face' crop="fill" />
        </Image>
      </div>
      <h1 className="name">{user.name + ' ' + user.surname}</h1>
      {!!user.age && <div className="age">{user.age + t('years')}</div>}
      <div className="gender">{user.gender}</div>
      {!!user && <div className="address">{address}</div>}
      {isEditabe ? 'editable' : 'static'}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    cloudName: state.app.cloudinaryCloudName
  }
}

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user_id: PropTypes.string.isRequired
    })
  }),
  userId: PropTypes.string,
  cloudName: PropTypes.string
}

export default withRouter(connect(mapStateToProps)(Profile))
