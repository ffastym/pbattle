/**
 * @author Yuriy Matviyuk
 */
const notifyActions = {
  /**
     * Set message of Material UI snackbar
     *
     * @param message
     * @param type string
     * @returns {{payload: *, type: string}}
     */
  setMessage: (message, type = 'success') => {
    return {
      type: 'SET_MESSAGE',
      payload: { message, type }
    }
  }
}

export default notifyActions
