import user from './axios/user'
import store from '../store'
import userActions from '../actions/userActions'

const autoLogin = storage => {
  let credentials = storage.getItem('credentials')

  if (credentials) {
    user.logIn(JSON.parse(credentials)).then(({ data }) => {
      if (data && data._id) {
        store.dispatch(userActions.signIn(data))
      }
    })
  }
}

const localStorageHelper = {
  /**
   * Log in by credentials from localStorage
   */
  signIn: () => {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage
      // eslint-disable-next-line no-global-assign
      autoLogin(new LocalStorage('./scratch'))
    } else {
      autoLogin(localStorage)
    }
  }
}

export default localStorageHelper
