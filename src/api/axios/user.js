/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import config from './config'

const server = config.serverApiPath

export default {
  /**
   * Login automatically when app load by credentials from local storage
   *
   * @param credentials
   *
   * @returns {AxiosPromise<any>}
   */
  logIn: credentials => {
    return axios.post(server + '/api/logIn', credentials)
  },

  /**
   * Set user gender (use in social login)
   *
   * @param id
   * @param gender
   *
   * @returns {Promise<AxiosResponse<T>>}
   */
  setGender: (id, gender) => {
    return axios.post(server + '/api/setUserGender', { id, gender })
  },

  /**
   * Sign in
   *
   * @param userData
   *
   * @returns {AxiosPromise<any>}
   */
  signIn: userData => {
    return axios.post(server + '/api/signIn', userData)
  },

  /**
   * Create new account
   *
   * @param userData
   *
   * @returns {AxiosPromise<any>}
   */
  signUp: userData => {
    return axios.post(server + '/api/signUp', userData)
  },

  /**
   * Save in db user subsription to the push notifications
   *
   * @param subscription
   * @param id
   *
   * @returns {AxiosPromise<any>}
   */
  saveSubscription: (subscription, id) => {
    return axios.post(server + '/api/saveSubscription', { subscription, id })
  },

  /**
   * Get all registered users
   *
   * @returns {AxiosPromise<any>}
   */
  getAllUsers: () => {
    return axios.get(server + '/api/getAllUsers')
  },

  /**
   * Set user profile photo
   *
   * @param data
   *
   * @returns {Promise<AxiosResponse<T>>}
   */
  setAvatar: data => {
    return axios.post(server + '/api/setAvatar', data)
  },

  /**
   * Get user profile data
   *
   * @param userId
   *
   * @returns {AxiosPromise<any>}
   */
  getUserProfile: userId => {
    return axios.post(server + '/api/getUserProfile', { userId })
  }
}
