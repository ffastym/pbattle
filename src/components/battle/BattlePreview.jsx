/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'
import cloudinary from '../../api/cloudinary'
import { useTranslation } from 'react-i18next'
import url from '../../config/url'
import {NavLink} from 'react-router-dom'

/**
 * BattlePreview component
 *
 * @param battle
 * @param checkBattle
 * @param checkMarks
 *
 * @returns {*}
 * @constructor
 */
const BattlePreview = ({ battle, checkBattle, type }) => {
  const { t } = useTranslation()
  const id = battle._id

  const handleClick = (e) => {
    if (type === 'active') {
      return
    }

    e.preventDefault()

    if (type === 'requested') {
      checkBattle(e)
    }
  }

  return (
    <NavLink to={url.battle + id} className="battle-preview" onClick={handleClick} data-id={id}>
      <span className="check-mark">{t('check')}</span>
      <div className="battle-image">
        <Image cloudName={cloudinary.cloudName} publicId={battle.users.user1.photo}>
          <Transformation height="200" fetchFormat="auto" width="140" gravity='face' crop="fill" />
        </Image>
      </div>
      <div className="battle-image">
        <Image cloudName={cloudinary.cloudName} publicId={battle.users.user2.photo}>
          <Transformation height="200" fetchFormat="auto" width="140" gravity='face' crop="fill" />
        </Image>
      </div>
    </NavLink>
  )
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = () => {
  return {}
}

BattlePreview.propTypes = {
  checkBattle: PropTypes.func,
  battle: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(BattlePreview)
