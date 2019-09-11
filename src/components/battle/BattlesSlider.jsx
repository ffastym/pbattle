/**
 * @author Yuriy Matviyuk
 */
import battle from '../../api/axios/battle'
import Loader from '../global/Loader'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import url from '../../config/url'
import userActions from '../../actions/userActions'
import SwipeableViews from 'react-swipeable-views'
import BattleBody from './BattleBody'
import SocialShare from '../global/SocialShare'

/**
 * BattlesSlider component
 */
class BattlesSlider extends Component {
  /**
 * BattlesSlider Constructor
 *
 * @param props
 */
  constructor (props) {
    super(props)

    this.state = {
      battles: [],
      activeIndex: 0
    }

    this.updateBattle = this.updateBattle.bind(this)
    this.changeIndex = this.changeIndex.bind(this)
    this.getBattlesList = this.getBattlesList.bind(this)
  }

  componentDidMount () {
    this.getActiveBattles()
  }

  getBattlesList () {
    let list = []

    this.state.battles.forEach((battle, index) => {
      list.push(
        <BattleBody
          battle={battle}
          key={index}
          updateBattle={this.updateBattle} />
      )
    })

    list.reverse()
    return list
  }

  updateBattle (battle) {
    this.props.addToLikedList(battle._id)
    this.setState(battle)
  }

  /**
  * Get random battle
  */
  getActiveBattles () {
    battle.getActiveBattles().then(res => {
      if (res.data.success === false) {
        return console.log('fetching battles err')
      }

      this.setState({ battles: res.data })
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log('Fetching random battle error ---> ', err)
    })
  }

  /**
   * Change active battle index
   *
   * @param activeIndex
   */
  changeIndex (activeIndex) {
    this.setState({ activeIndex })
  }

  /**
     * Render BattlesSlider component
     */
  render () {
    const battles = this.state.battles

    if (!battles.length) {
      return <Loader text="battleLoading"/>
    }

    const activeIndex = this.state.activeIndex

    return (
      <div className="battle-wrapper">
        <div className="title">
          <Trans>choseBestPhoto</Trans>
        </div>
        <div className="slider-area">
          <SwipeableViews axis='x'
            slideStyle={{ width: '92%', marginRight: '10px', height: 'auto' }}
            index={activeIndex}
            onChangeIndex={this.changeIndex}
            slideClassName='battle-slide'>
            {this.getBattlesList()}
          </SwipeableViews>
        </div>
        <SocialShare url={url.base + url.battle.replace(':battle_id', battles[activeIndex]._id)}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    likedBattles: state.user.likedBattles
  }
}

const mapDispatchToProps = (dispatch) => {
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

BattlesSlider.propTypes = {
  isLoggedIn: PropTypes.bool,
  likedBattles: PropTypes.array,
  addToLikedList: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(BattlesSlider)
