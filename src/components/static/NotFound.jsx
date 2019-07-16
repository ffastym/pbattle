/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import url from '../../config/url'
import { Link } from 'react-router-dom'

/**
 * NotFound page component
 *
 * @returns {*}
 * @constructor
 */
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Сторінку не знайдено</p>
      <Link to={url.home}>Повернутися на головну</Link>
    </div>
  )
}

export default NotFound
