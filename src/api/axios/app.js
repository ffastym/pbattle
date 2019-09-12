/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import config from './config'

const server = config.serverApiPath

export default {
  /**
   * Send email
   *
   * @param message
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendMail (message) {
    return axios.post(server + '/api/sendMail', { message })
  }
}
