/**
 * @author Yuriy Matviyuk
 */
import store from '../store'
import appActions from './appActions'
import socket from '../api/socket'

const userActions = {
  /**
     * Set user as logged in
     *
     * @param userData
     *
     * @returns {{payload: *, type: string}}
     */
  signIn (userData) {
    localStorage.setItem('credentials', JSON.stringify({
      email: userData.email,
      password: userData.password
    }))

    if (userData.gender !== 'none') { // Hide login popin if user has gender
      store.dispatch(appActions.openLogin(false))
    }

    socket.subscribeNotifications(userData._id)

    delete userData.password
    userData.isLoggedIn = true

    return {
      type: 'SIGN_IN',
      payload: userData
    }
  },

  /**
   * Set new user's notifications
   *
   * @param data
   * @returns {{payload: *, type: string}}
   */
  setNotifications (data) {
    return {
      type: 'SET_NOTIFICATIONS',
      payload: data
    }
  },

  /**
   * Add new battle to liked list
   *
   * @param id
   * @returns {{payload: *, type: string}}
   */
  addToLikedList: id => {
    return {
      type: 'ADD_TO_LIKED',
      payload: id
    }
  },

  /**
   * Add new battles to the list
   *
   * @param ids
   * @returns {{payload: *, type: string}}
   */
  updateBattles: ids => {
    return {
      type: 'UPDATE_BATTLES',
      payload: ids
    }
  },

  /**
   * Set user profile photo
   *
   * @param photo
   * @returns {{payload: *, type: string}}
   */
  setAvatar: photo => {
    return {
      type: 'SET_AVATAR',
      payload: photo
    }
  },

  /**
   * Set user gender
   *
   * @param gender
   * @returns {{payload: *, type: string}}
   */
  setGender: gender => {
    return {
      type: 'SET_GENDER',
      payload: gender
    }
  },

  /**
     * Logout
     *
     * @returns {{type: string}}
     */
  logOut: () => {
    localStorage.removeItem('credentials')

    return {
      type: 'LOGOUT'
    }
  }
}

export default userActions
