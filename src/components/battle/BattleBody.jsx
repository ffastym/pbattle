/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import UserData from './UserData'
import ProgressBar from '../global/ProgressBar'
import { connect } from 'react-redux'

/**
 * BattleBody component
 *
 * @param battle
 * @param updateBattle
 * @param isLoggedIn
 * @param likedBattles
 *
 * @returns {*}
 * @constructor
 */
const BattleBody = ({ battle, updateBattle, isLoggedIn, likedBattles }) => {
  const curBattle = { ...battle }
  let battleLikesQty = 0
  let isShowResult = isLoggedIn && likedBattles.includes(battle._id)

  Object.entries(curBattle.users).forEach(([id, user]) => {
    battleLikesQty += user.likesQty
  })

  const successLikeHandler = index => {
    curBattle.users['user' + index].likesQty++
    curBattle.users['user' + index].data.rating++
    updateBattle(curBattle)
  }

  /**
   * Get battle participants data
   *
   * @returns {[]}
   */
  const getUsersData = () => {
    const users = curBattle.users
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
          isShowResult={isShowResult}
          likes={userInfo.likesQty}
          id={userInfo.data._id}
          battleId={curBattle._id}
          successLikeHandler={() => successLikeHandler(index)}
          photo={userInfo.photo}
          rating={userInfo.data.rating}
        />
      )

      index++
    }

    return usersData
  }

  const getBattleSummary = () => {
    let summaryHtml = []
    let index = 1

    Object.entries(curBattle.users).forEach(([id, user]) => {
      const userLikesQty = user.likesQty
      const proggress = userLikesQty !== 0 && isShowResult ? userLikesQty / battleLikesQty * 100 : 0

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

  return (
    <div className="battle-body">
      <div className="user-container">{getUsersData()}</div>
      <div className="battle-summary">{getBattleSummary()}</div>
    </div>
  )
}

BattleBody.propTypes = {
  battle: PropTypes.object,
  isShowResult: PropTypes.bool,
  updateBattle: PropTypes.func,
  likedBattles: PropTypes.array,
  isLoggedIn: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    likedBattles: state.user.likedBattles
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BattleBody)
