/**
 * @author Yuriy Matviyuk
 */
const initialState = {
  id: null,
  isLoggedIn: false,
  name: null,
  surname: null,
  email: null,
  gender: null
}

/**
 * user reducer
 *
 * @param state
 * @param action
 *
 * @returns {{id, login}}
 */
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      action.payload.id = action.payload._id
      delete action.payload._id

      state = {
        ...state,
        ...action.payload
      }
      break
    case 'LOGOUT':
      state = { ...state }

      Object.keys(state).forEach(key => {
        state[key] = null
      })
      break
    case 'UPDATE_BATTLES':
      state = {
        ...state,
        battles: [...state.battles, ...action.payload]
      }
      break
    default:
      state = {
        ...state
      }
  }

  return state
}

export default userReducer
