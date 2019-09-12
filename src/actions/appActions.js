/**
 * @author Yuriy Matviyuk
 *
 * App actions
 */
import localStorageHelper from '../api/localStorageHelper'

const appActions = {
  /**
   * Show/hide login popin
   *
   * @param isOpen
   *
   * @returns {{type: string}}
   */
  openLogin: (isOpen) => {
    return {
      type: 'OPEN_LOGIN',
      payload: isOpen
    }
  },

  /**
   * Accept cookies
   *
   * @returns {{type: string}}
   */
  acceptCookies: () => {
    localStorageHelper.getLocalStorage().setItem('acceptCookies', 'true')

    return {
      type: 'ACCEPT_COOKIES'
    }
  },

  /**
   * Show/hide menu
   *
   * @param isOpen
   *
   * @returns {{payload: *, type: string}}
   */
  toggleMenu: (isOpen = null) => {
    return {
      type: 'TOGGLE_MENU',
      payload: isOpen
    }
  }
}

export default appActions
