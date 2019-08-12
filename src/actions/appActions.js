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
   * @returns {{type: string}}
   */
  openLogin: (isOpen) => {
    return {
      type: 'OPEN_LOGIN',
      payload: isOpen
    }
  }
}

export default appActions
