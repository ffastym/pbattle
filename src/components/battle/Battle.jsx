/**
 * @author Yuriy Matviyuk
 */
import battle from '../../api/axios/battle'
import Loader from '../global/Loader'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import userActions from '../../actions/userActions'
import SwipeableViews from 'react-swipeable-views'
import BattleBody from './BattleBody'

/**
 * Battle component
 */
class Battle extends Component {
  /**
 * Battle Constructor
 *
 * @param props
 */
  constructor (props) {
    super(props)

    this.state = {
      battles: []
    }

    this.updateBattle = this.updateBattle.bind(this)
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
     * Render Battle component
     */
  render () {
    if (!this.state.battles.length) {
      return <Loader text="battleLoading"/>
    }

    return (
      <div className="battle-wrapper">
        <div className="title">
          <Trans>chosePhoto</Trans>
        </div>
        <SwipeableViews axis='x'
          slideStyle={{ width: '92%', marginRight: '10px', height: 'auto' }}
          slideClassName='battle-slide'>
          {this.getBattlesList()}
        </SwipeableViews>
        <div className="share-form">
          <FacebookShareButton url="/">
            <FacebookIcon size={32} round={true}/>
          </FacebookShareButton>
          <TelegramShareButton url="/">
            <TelegramIcon size={32} round={true}/>
          </TelegramShareButton>
          <ViberShareButton url="/">
            <ViberIcon size={32} round={true}/>
          </ViberShareButton>
          <WhatsappShareButton url="/">
            <WhatsappIcon size={32} round={true}/>
          </WhatsappShareButton>
          <TwitterShareButton url="/">
            <TwitterIcon size={32} round={true}/>
          </TwitterShareButton>
        </div>
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

Battle.propTypes = {
  isLoggedIn: PropTypes.bool,
  likedBattles: PropTypes.array,
  addToLikedList: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Battle)
