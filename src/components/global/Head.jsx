/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
/**
 * Head component
 *
 * @param name
 * @param ssr
 *
 * @returns {*}
 * @constructor
 */

const Head = ({ name, ssr }) => {
  let title = 'Підслухано'
  let description = 'Цікаві історії, захоплюючі зізнання'
  let keywords = 'форум, анонімний форум, шукаю тебе, тз, шт, зізнання, типове зізнання, підслухано'

  if (name) {
    let location = ' ' + name

    title += location
    description += location
    keywords += location
  }

  return (
    !ssr
      ? <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keywords' content={keywords}/>
      </Helmet>
      : <React.Fragment>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keywords' content={keywords}/>
      </React.Fragment>
  )
}

Head.propTypes = {
  name: PropTypes.string,
  ssr: PropTypes.boolean
}

export default Head
