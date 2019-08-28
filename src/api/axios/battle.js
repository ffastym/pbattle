/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import config from './config'

const server = config.serverApiPath

export default {
  /**
   * Get all possible opponents for new battle
   *
   * @param data
   *
   * @returns {AxiosPromise<any>}
   */
  getOpponents: (data) => {
    return axios.post(server + '/api/getOpponents', data)
  },

  /**
   * Get battle byId
   *
   * @param id
   * @returns {Promise<AxiosResponse<T>>}
   */
  getBattle: id => {
    return axios.post(server + '/api/getBattle', { id })
  },

  /**
   * Create battles and send request to opponents
   *
   * @param opponents
   * @param user
   *
   * @returns {AxiosPromise<any>}
   */
  requestBattles: (opponents, user) => {
    return axios.post(server + '/api/requestBattle', { opponents, user })
  },

  /**
   * Accept battle requests
   *
   * @param battleIds
   *
   * @returns {Promise<AxiosResponse<T>>}
   */
  acceptBattles: battleIds => {
    return axios.post(server + '/api/acceptBattles', battleIds)
  },

  /**
   * Reject selected battles requests
   *
   * @param battleIds
   *
   * @returns {Promise<AxiosResponse<T>>}
   */
  rejectBattles: battleIds => {
    return axios.post(server + '/api/rejectBattles', battleIds)
  },

  /**
   * Like battle photo
   *
   * @param actionData
   *
   * @returns {AxiosPromise<any>}
   */
  likeBattlePhoto: (actionData) => {
    return axios.post(server + '/api/likeBattlePhoto', actionData)
  },

  /**
   * Get all active battles array
   *
   * @returns {AxiosPromise<any>}
   */
  getActiveBattles: () => {
    return axios.get(server + '/api/getActiveBattles')
  },

  /**
   * Get all user battles
   *
   * @param ids
   *
   * @returns {Promise<AxiosResponse<T>>}
   */
  getUserBattles: ids => {
    return axios.post(server + '/api/getUserBattles', { ids })
  }
}
