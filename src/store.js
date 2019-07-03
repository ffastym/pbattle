/**
 * @author Yuriy Matviyuk
 */
import app from './reducers/appReducer'
import logger from 'redux-logger'
import battle from './reducers/battleReducer'
import notify from './reducers/notifyReducer'
import thunk from 'redux-thunk'
import user from './reducers/userReducer'
import { createStore, combineReducers, applyMiddleware } from 'redux'

let middleware = [thunk]

if (process.env.NODE_ENV === 'development') { // enable logger in develop mode
  middleware = [...middleware, logger]
}

export default createStore(
  combineReducers({ app, user, battle, notify }),
  {},
  applyMiddleware(...middleware)
)
