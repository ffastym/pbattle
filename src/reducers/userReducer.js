import { subscribeUser } from '../subscription'

/**
 * @author Yuriy Matviyuk
 */
const initialState = {
  id: null,
  isLoggedIn: false,
  name: null,
  surname: null,
  likedBattles: [],
  notifications: [],
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
      subscribeUser()
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
    case 'ADD_TO_LIKED':
      state = {
        ...state,
        likedBattles: [...state.likedBattles, action.payload]
      }
      break
    case 'SET_AVATAR':
      state = {
        ...state,
        avatar: action.payload
      }
      break
    case 'SET_GENDER':
      state = {
        ...state,
        gender: action.payload
      }
      break
    case 'SET_NOTIFICATIONS':
      state = {
        ...state,
        notifications: action.payload
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
