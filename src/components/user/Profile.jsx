/**
 * @author Yuriy Matviyuk
 */
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

/**
 * Profile component
 *
 * @param match
 * @param userId
 *
 * @returns {*}
 * @constructor
 */
const Profile = ({ match, userId }) => {
  const isEditabe = match.params.user_id === userId

  return (
    <div>
      {isEditabe ? 'editable' : 'static'}
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
