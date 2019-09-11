/**
 * @author Yuriy Matviyuk
 */
import battle from '../../api/axios/battle'
import BattleBody from './BattleBody'
import Loader from '../global/Loader'
import PropTypes from 'prop-types'
import React, { Fragment, Component } from 'react'
import SocialShare from '../global/SocialShare'
import url from '../../config/url'
import userActions from '../../actions/userActions'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { withRouter } from 'react-router-dom'

/**
 * BattleView component
 */
class BattleView extends Component {
  /**
   * BattleView Constructor
   *
   * @param props
   */
  constructor (props) {
    super(props)
    const battleId = props.match.params.battle_id

    this.state = {
      battle: null
    }

    this.updateBattle = this.updateBattle.bind(this)

    battle.getBattle(battleId).then(({ data }) => {
      this.setState({
        battle: data.battle
      })
    })
  }

  /**
   * Update current battle
   *
   * @param battle
   */
  updateBattle (battle) {
    this.props.addToLikedList(battle._id)
    this.setState(battle)
  }

  render () {
    const battle = this.state.battle

    return (
      <div className='battle-wrapper battle-view'>
        <h1 className="title">
          <Trans>Battle</Trans>
        </h1>
        {battle
          ? <Fragment>
            <BattleBody
              battle={battle}
              updateBattle={this.updateBattle} />
            <SocialShare url={url.base + url.battle.replace(':battle_id', battle._id)}/>
          </Fragment>
          : <Loader/>}
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    /**
     * Add new battle to liked list
     *
     * @param id
     */
    addToLikedList: id => {
      dispatch(userActions.addToLikedList(id))
    }
  }
}

BattleView.propTypes = {
  addToLikedList: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      battle_id: PropTypes.string.isRequired
    })
  })
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BattleView))
