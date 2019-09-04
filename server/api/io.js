/**
 * @author Yuriy Matviyuk
 */
import socketIo from 'socket.io'
import userRequest from './axios/user'

/**
 * Subscribe server events
 */
const io = {
  users: {},

  io: null,

  listen (server) {
    this.io = socketIo(server)

    // associate user with current socket id
    this.io.use((socket, next) => {
      let userId = socket.handshake.query.id

      if (userId) {
        this.users[userId] = socket.id

        return next()
      }

      return next(new Error('authentication error'))
    })
  },

  /**
   * Send notification to the client
   *
   * @param userId
   * @param notification
   * @param additionalData
   */
  sendNotification (userId, notification, additionalData = {}) {
    this.io.to(this.users[userId]).emit('send notification', { notification, additionalData })
  }
}

export default io
