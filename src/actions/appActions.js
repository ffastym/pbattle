/**
 * @author Yuriy Matviyuk
 *
 * App actions
 */
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
