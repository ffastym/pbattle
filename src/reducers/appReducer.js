/**
 * @author Yuriy Matviyuk
 */
const initialState = {
  isMobile: true,
  isAcceptCookies: false,
  isWebcamActive: false
}

/**
 * App reducer
 *
 * @param state
 * @param action
 *
 * @returns {{isAcceptCookies, isMobile}&{isAcceptCookies: boolean}}
 */
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ACCEPT_COOKIES':
      state = {
        ...state,
        isAcceptCookies: true
      }
      break
    case 'SET_DEVICE_TYPE':
      state = {
        ...state,
        isMobile: action.payload
      }
      break
    case 'SWITCH_WEBCAM':
      state = {
        ...state,
        isWebcamActive: !state.isWebcamActive
      }
      break
    default:
      state = {
        ...state
      }
  }

  return state
}

export default appReducer
