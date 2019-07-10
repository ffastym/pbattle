/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Image, Transformation } from 'cloudinary-react'
import { connect } from 'react-redux'

/**
 * UserData component
 *
 * @param photo
 * @param firstname
 * @param rating
 * @param likes
 * @param cloudName
 *
 * @returns {*}
 * @constructor
 */
const UserData = ({ photo, name, rating, likes, cloudName }) => {
  return (
    <div className="battle-user">
      <div className="user-photo">
        <Image cloudName={cloudName} publicId={photo}>
          <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
        </Image>
      </div>
      <div className="user-summary">
        <div className="user-name">{name}</div>
        <div className="user-likes user-qty">{likes}</div>
        <div className="user-rating user-qty">{rating}</div>
      </div>
    </div>
  )
}

UserData.propTypes = {
  photo: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  likes: PropTypes.number,
  cloudName: PropTypes.string
}

const mapStateToProps = state => {
  return {
    cloudName: state.app.cloudinaryCloudName
  }
}

export default connect(mapStateToProps)(UserData)
