/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

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
      <img className='list-item-photo' src={user.photos[0]} alt=''/>
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
