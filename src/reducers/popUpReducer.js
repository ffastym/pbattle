/**
 * @author Yuriy Matviyuk
 */
const initialState = {
  isPopUpShow: false,
  type: null
}

/**
 * Pop Up reducer
 *
 * @param state
 * @param action
 *
 * @returns {{isPopUpShow, type}&{isPopUpShow: boolean, type: *}}
 */
const popUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_POPUP' :
      state = {
        ...state,
        type: action.payload,
        isPopUpShow: true
      }
      break
    case 'HIDE_POPUP' :
      state = {
        ...state,
        isPopUpShow: false
      }
      break
    default:
      state = {
        ...state
      }
  }

  return state
}

export default popUpReducer
