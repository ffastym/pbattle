/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * BattlesActionsPanel component
 *
 * @param qty
 * @param uncheckAll
 * @param acceptBattles
 * @param removeBattles
 *
 * @returns {*}
 * @constructor
 */
const BattlesActionsPanel = ({ qty, uncheckAll, acceptBattles, removeBattles }) => {
  const { t } = useTranslation()

  return (
    <div className='battles-actions-panel'>
      <div className='chosen-qty'>{t('%1BattlesChosen').replace('%1', qty)}</div>
      <div className="actions-wrapper">
        <span className="action accept" onClick={acceptBattles}/>
        <span className="action remove" onClick={removeBattles}/>
        <span className="action close" onClick={uncheckAll}/>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

BattlesActionsPanel.propTypes = {
  qty: PropTypes.number,
  uncheckAll: PropTypes.func,
  acceptBattles: PropTypes.func,
  removeBattles: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(BattlesActionsPanel)
