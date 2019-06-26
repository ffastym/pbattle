/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

/**
 * Loader component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Loader = ({ text }) => {
  const { t } = useTranslation()

  return (
    <div className='loading'>
      <span className="loader"/>
      <p className="className">{t(text)}</p>
    </div>
  )
}

Loader.propTypes = {
  text: PropTypes.string
}

export default Loader
