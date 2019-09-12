import user from './axios/user'
import store from '../store'
import userActions from '../actions/userActions'

const localStorageHelper = {
  /**
   * Log in by credentials from localStorage
   */
  signIn () {
    let credentials = this.getLocalStorage().getItem('credentials')

    if (credentials) {
      user.logIn(JSON.parse(credentials)).then(({ data }) => {
        if (data && data._id) {
          store.dispatch(userActions.signIn(data))
        }
      })
    }
  },

  /**
   * Get local storage
   *
   * @returns {Storage}
   */
  getLocalStorage () {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage
      // eslint-disable-next-line no-global-assign
      return new LocalStorage('./scratch')
    } else {
      return localStorage
    }
  }
}

export default localStorageHelper
