/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * ProgressBar component
 *
 * @param percent
 * @param color
 * @param votes
 *
 * @returns {*}
 * @constructor
 */
const ProgressBar = ({ percent, color, votes }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar-active" style={{ background: color, width: percent + '%' }}>
        <span className="progress-bar-summary">{percent + '% / ' + votes}</span>
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  percent: PropTypes.number,
  color: PropTypes.string,
  votes: PropTypes.number
}

export default ProgressBar
