/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
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
        <NavLink to="/" className="action home"/>
        <NavLink to="/new_photo" className="action add-photo"/>
        <NavLink to="/liked" className="action liked"/>
        <NavLink to="/rating" className="action rating"/>
      </div>
    </footer>
  )
}

export default Footer
