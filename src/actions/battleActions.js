/**
 * @author Yuriy Matviyuk
 */
const battleActions = {
  /**
   * Set photo for new battle
   *
   * @param photo
   * @returns {{type: string}}
   */
  setNewPhoto: (photo) => {
    return {
      type: 'SET_NEW_PHOTO',
      payload: photo
    }
  }
}

export default battleActions
