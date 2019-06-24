/**
 * @author Yuriy Matviyuk
 */
import React from 'react'

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
const ProgressBar = ({percent, color, votes}) => {
    return (
        <div className="progress-bar">
            <div className="progress-bar-active" style={{background: color, width: percent + '%'}}>
                <span className="progress-bar-summary">{percent + '% / ' + votes}</span>
            </div>
        </div>
    )
};

export default ProgressBar
