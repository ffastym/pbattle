/**
 * @author Yuriy Matviyuk
 */

/**
 * All site routes config
 */
const url = {
  base: process.env === 'production' ? 'https://pbattle.herokuapp.com/' : 'localhost:3000',
  contactUs: '/contact_us',
  home: '/',
  battle: '/battle/:battle_id',
  myBattles: '/my_battles',
  newBattle: '/new_battle',
  notifications: '/notifications',
  privacyPolicy: '/privacy_policy',
  profile: '/profile/:user_id',
  rating: '/rating',
  registration: '/registration'
}

export default url
