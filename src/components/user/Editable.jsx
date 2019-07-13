/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import { Image, Transformation } from 'cloudinary-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * Editable component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Editable = (props) => {
  const { t } = useTranslation()
  const address = props.country ? props.country + props.city ? ', ' + props.city : '' : ''

  return (
    <div className='user-profile'>
      <div className="profile-photo-wrapper">
        <Image cloudName={props.cloudName} publicId={props.avatar}>
          <Transformation height="200" fetchFormat="auto" width="150" gravity='face' crop="fill" />
        </Image>
      </div>
      <h1 className="name">{props.name + ' ' + props.surname}</h1>
      {!!props.age && <div className="age">{props.age + t('years')}</div>}
      <div className="gender">{props.gender}</div>
      {!!address && <div className="address">{address}</div>}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    cloudName: state.app.cloudinaryCloudName,
    avatar: state.user.avatar,
    name: state.user.name,
    surname: state.user.surname,
    gender: state.user.gender,
    age: state.user.age,
    country: state.user.country,
    city: state.user.city
  }
}

Editable.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user_id: PropTypes.string.isRequired
    })
  }),
  userId: PropTypes.string,
  avatar: PropTypes.string,
  cloudName: PropTypes.string,
  name: PropTypes.string,
  surname: PropTypes.string,
  gender: PropTypes.string,
  age: PropTypes.number,
  country: PropTypes.string,
  city: PropTypes.string
}

export default withRouter(connect(mapStateToProps)(Editable))