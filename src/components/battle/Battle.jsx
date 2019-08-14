/**
 * @author Yuriy Matviyuk
 */
import battle from '../../api/axios/battle'
import Loader from '../global/Loader'
import ProgressBar from '../global/ProgressBar'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UserData from './UserData'
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
import user from '../../api/axios/user'
import userActions from '../../actions/userActions'

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
      battles: null,
      isShowResult: props.isLoggedIn
    }

    this.getRandomBattle = this.getRandomBattle.bind(this)
    this.successLikeHandler = this.successLikeHandler.bind(this)
    this.getUsersData = this.getUsersData.bind(this)
    this.getBattleSummary = this.getBattleSummary.bind(this)
  }

  componentDidMount () {
    this.getActiveBattles()
  }

  static getDerivedStateFromProps (nextProps, state) {
    const battle = state.battle

    if (battle && nextProps.isLoggedIn && nextProps.likedBattles.includes(battle._id)) {
      return {
        isShowResult: true
      }
    }

    return null
  }

  /**
  * Get random battle
  */
  getActiveBattles () {
    battle.getActiveBattles().then(res => {
      if (res.data.success === false) {
        return console.log('fetching battles err')
      }

      this.setState({ battles: res.data }, this.getRandomBattle)
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log('Fetching random battle error ---> ', err)
    })
  }

  getRandomBattle () {
    const battlesQty = this.state.battles.length
    const randBattleIndex = Math.floor(Math.random() * battlesQty)
    this.setState({ battle: this.state.battles[randBattleIndex] })
  }

  successLikeHandler (index) {
    let battle = this.state.battle

    battle.users['user' + index].likesQty++
    battle.users['user' + index].data.rating++
    this.props.addToLikedList(battle._id)
    this.setState(battle)
  }

  getUsersData (battle) {
    const users = battle.users
    let usersData = []
    let index = 1

    for (let user in users) {
      if (!users.hasOwnProperty(user)) {
        continue
      }

      let userInfo = users[user]

      usersData.push(
        <UserData name={userInfo.data.name}
          key={index}
          index={index}
          isShowResult={this.state.isShowResult}
          likes={userInfo.likesQty}
          id={userInfo.data._id}
          battleId={battle._id}
          successLikeHandler={this.successLikeHandler}
          photo={userInfo.photo}
          rating={userInfo.data.rating}
        />
      )

      index++
    }

    return usersData
  }

  getBattleSummary (battle, allLikesQty) {
    let summaryHtml = []
    let index = 1
    const isShowResult = this.state.isShowResult

    Object.entries(battle.users).forEach(([id, user]) => {
      const userLikesQty = user.likesQty
      const proggress = userLikesQty !== 0 && isShowResult ? userLikesQty / allLikesQty * 100 : 0

      summaryHtml.push(
        <div key={index} className={'battle-result ' + id}>
          <ProgressBar percent={proggress.toFixed(1)}
            color={index === 1 ? '#4A9000' : 'dodgerblue'}
            votes={isShowResult ? userLikesQty : 0}/>
        </div>
      )

      index++
    })

    return summaryHtml
  }

  /**
     * Render Battle component
     */
  render () {
    const battle = this.state.battle

    if (!battle) {
      return <Loader text="battleLoading"/>
    }

    let likesQty = 0

    Object.entries(battle.users).forEach(([id, user]) => {
      likesQty += user.likesQty
    })

    return (
      <div className="battle-wrapper">
        <div className="title">
          <Trans>chosePhoto</Trans>
        </div>
        <div className="battle-body">
          <div className="user-container">{this.getUsersData(battle)}</div>
          <div className="battle-summary">{this.getBattleSummary(battle, likesQty)}</div>
        </div>
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
