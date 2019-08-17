/**
 * @author Yuriy Matviyuk
 */
import cloudinary from '../../api/cloudinary'
import PropTypes from 'prop-types'
import React from 'react'
import { Image, Transformation } from 'cloudinary-react'

/**
 * RatingRow component
 *
 * @param user
 * @param index
 *
 * @returns {*}
 * @constructor
 */
const RatingRow = ({ user, index }) => {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        {user.avatar
          ? <Image cloudName={cloudinary.cloudName} publicId={user.avatar}>
            <Transformation height="60" fetchFormat="auto" width="45" gravity='face' crop="fill" />
          </Image>
          : <img src='/images/profile.png' width='45px' height='60px' alt='user'/>}
      </td>
      <td>{user.name + ' ' + user.surname}</td>
      <td>{user.battles.length}</td>
      <td>{user.rating}</td>
    </tr>
  )
}

RatingRow.propTypes = {
  index: PropTypes.number,
  user: PropTypes.shape({
    name: PropTypes.string,
    battles: PropTypes.array,
    rating: PropTypes.number,
    surname: PropTypes.string,
    avatar: PropTypes.string
  })
}

export default RatingRow
