/**
 * @author Yuriy Matviyuk
 */

export default {
  serverApiPath: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
}
