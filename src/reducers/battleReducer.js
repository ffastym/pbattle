/**
 * @author Yuriy Matviyuk
 */
const initialState = {
  newPhoto: null
}

const battleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NEW_PHOTO':
      state = {
        ...state,
        newPhoto: action.payload
      }
      break
    default:
      state = {
        ...state
      }
  }

  return state
}

export default battleReducer
