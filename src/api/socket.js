/**
 * Socket.io client api
 *
 * @author Yuriy Matviyuk
 */

import io from 'socket.io-client'
import store from '../store'
import userActions from '../actions/userActions'

const socket = {
  /**
   * Default socket namespace
   */
  battle: null,

  /**
   * Connect to default (battle) namespace
   *
   * @param userId
   *
   * @returns {*}
   */
  io (userId = null) {
    if (!this.battle) {
      this.battle = io(process.env.NODE_ENV === 'development' ? 'localhost:3001?id=' + userId : '/' + userId)
    }

    return this.battle
  },

  /**
   * Subscribe for new notifications
   *
   * @param id
   */
  subscribeNotifications (id) {
    this.io(id).on('send notification', ({ notification, additionalData }) => {
      store.dispatch(userActions.setNotifications([notification, ...store.getState().user.notifications]))
      store.dispatch(userActions.updateBattles([additionalData.battleId]))
    })
  }
}

export default socket
