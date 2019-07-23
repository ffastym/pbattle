/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import url from '../../config/url'
import { NavLink } from 'react-router-dom'

/**
 * Footer component
 *
 * @returns {*}
 * @constructor
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="actions-panel">
        <NavLink exact to={url.home} className="action home"/>
        <NavLink to={url.notifications} className="action notifications"/>
        <NavLink to={url.newBattle} className="action add-photo"/>
        <NavLink to={url.myBattles} className="action battles"/>
        <NavLink to={url.rating} className="action rating"/>
      </div>
    </footer>
  )
}

export default Footer
