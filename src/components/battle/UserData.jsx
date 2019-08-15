/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Image, Transformation } from 'cloudinary-react'
import { connect } from 'react-redux'
import battle from '../../api/axios/battle'
import notifyActions from '../../actions/notifyActions'
import cloudinary from '../../api/cloudinary'
import appActions from '../../actions/appActions'

/**
 * UserData component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
const UserData = (props) => {
  let isVisible = props.isShowResult
  const like = () => {
    if (!props.isLoggedIn) {
      return props.openLogin()
    }

    if (props.likedBattles.includes(props.battleId)) {
      return
    }

    const actionData = {
      battleId: props.battleId,
      index: props.index,
      userId: props.userId
    }

    battle.likeBattlePhoto(actionData).then(({ data }) => {
      if (data.success === false) {
        return props.setNotify('likePhotoError', 'error')
      }

      if (data.success === true) {
        props.successLikeHandler(props.index)
      }
    })
  }

  return (
    <div className="battle-user">
      <div className="user-photo" onDoubleClick={like}>
        <Image cloudName={cloudinary.cloudName} publicId={props.photo}>
          <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
        </Image>
      </div>
      <div className="user-summary">
        <div className="user-name">{props.name}</div>
        <div className="user-likes user-qty">{isVisible ? props.likes : '?'}</div>
        <div className="user-rating user-qty">{isVisible ? props.rating : '?'}</div>
      </div>
    </div>
  )
}

UserData.propTypes = {
  photo: PropTypes.string,
  name: PropTypes.string,
  userId: PropTypes.string,
  rating: PropTypes.number,
  isShowResult: PropTypes.bool,
  likedBattles: PropTypes.array,
  likes: PropTypes.number,
  id: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  openLogin: PropTypes.func,
  battleId: PropTypes.string,
  setNotify: PropTypes.func,
  index: PropTypes.number,
  successLikeHandler: PropTypes.func
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userId: state.user.id,
    likedBattles: state.user.likedBattles
  }
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
    },

    /**
     * Show login popin
     */
    openLogin: () => {
      dispatch(appActions.openLogin(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserData)
