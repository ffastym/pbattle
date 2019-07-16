/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Image, Transformation } from 'cloudinary-react'
import { connect } from 'react-redux'
import axios from 'axios'
import notifyActions from '../../actions/notifyActions'
import cloudinary from '../../api/cloudinary'

/**
 * UserData component
 *
 * @param photo
 * @param firstname
 * @param rating
 * @param likes
 * @param userId
 * @param battleId
 * @param setNotify
 * @param index
 * @param successLikeHandler
 *
 * @returns {*}
 * @constructor
 */
const UserData = ({ photo, name, rating, likes, userId, battleId, setNotify, index, successLikeHandler }) => {
  const like = () => {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

    axios.post(serverApiPath + '/api/likeBattlePhoto', { battleId, userId, index }).then(({ data }) => {
      if (data.success === false) {
        return setNotify('likePhotoError', 'error')
      }

      if (data.success === true) {
        successLikeHandler(index)
      }
    })
  }

  return (
    <div className="battle-user">
      <div className="user-photo" onClick={like}>
        <Image cloudName={cloudinary.cloudName} publicId={photo}>
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
  userId: PropTypes.string,
  battleId: PropTypes.string,
  setNotify: PropTypes.func,
  index: PropTypes.number,
  successLikeHandler: PropTypes.func
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
     * Set message of material UI snackbar
     *
     * @param message
     * @param type
     */
    setNotify: (message, type) => {
      dispatch(notifyActions.setMessage(message, type))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserData)
