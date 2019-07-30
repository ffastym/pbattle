/**
 * @author Yuriy Matviyuk
 */
import renderer from './renderer'

const renderHome = (req, res) => {
  return renderer(req.url, res)
}

export default renderHome
