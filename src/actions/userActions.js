/**
 * @author Yuriy Matviyuk
 */
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

    delete userData.password
    userData.isLoggedIn = true

    return {
      type: 'SIGN_IN',
      payload: userData
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
