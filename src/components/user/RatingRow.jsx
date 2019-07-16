/**
 * @author Yuriy Matviyuk
 */
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'

/**
 * RatingRow component
 *
 * @param user
 * @param index
 * @param cloudName
 *
 * @returns {*}
 * @constructor
 */
const RatingRow = ({ user, index, cloudName }) => {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        <Image cloudName={cloudName} publicId={user.avatar}>
          <Transformation height="60" fetchFormat="auto" width="45" gravity='face' crop="fill" />
        </Image>
      </td>
      <td>{user.name + ' ' + user.surname}</td>
      <td>{user.battles.length}</td>
      <td>{user.rating}</td>
    </tr>
  )
}

const mapStateToProps = state => {
  return {
    cloudName: state.app.cloudinaryCloudName
  }
}

const mapDispatchToProps = () => {
  return {}
}

RatingRow.propTypes = {
  index: PropTypes.number,
  cloudName: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    battles: PropTypes.array,
    rating: PropTypes.number,
    surname: PropTypes.string,
    avatar: PropTypes.string
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(RatingRow)
