/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import cloudinary from '../../api/cloudinary'
import { Image, Transformation } from 'cloudinary-react'

/**
 * NewOpponent component
 *
 * @param id
 * @param user
 * @param removeOpponent
 *
 * @returns {*}
 * @constructor
 */
const NewOpponent = ({ id, user, removeOpponent }) => {
  const { t } = useTranslation()
  let winsQty = 0
  let battlesQty = user.battles.length

  user.battles.forEach(battle => {
    if (battle.winner === id) {
      winsQty++
    }
  })

  let winsPercent = battlesQty ? winsQty / battlesQty * 100 : 0

  return (
    <li>
      <Image cloudName={cloudinary.cloudName} publicId={user.avatar} className='list-item-photo'>
        <Transformation height="50" fetchFormat="auto" width="36" gravity='face' crop="fill" />
      </Image>
      <div className='list-item-info'>
        <span className="name">{user.name + ' ' + user.surname}</span>
        <div className="additional-info">
          <span className="rating">{user.rating}</span>
          <span className="battles-qty">{battlesQty}</span>
          <span className="wins-percent">{winsPercent + '%'}</span>
        </div>
      </div>
      <span className="action remove" onClick={removeOpponent} data-id={id} title={t('removeItem')}/>
    </li>
  )
}

NewOpponent.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string,
  removeOpponent: PropTypes.func
}

export default NewOpponent
