/**
 * @author Yuriy Matviyuk
 */
import React, { Component } from 'react'
import { Trans } from 'react-i18next'

/**
 * MyBattles component
 */
class MyBattles extends Component {
  /**
     * MyBattles Constructor
     *
     * @param props
     */
  constructor (props) {
    super(props)
        
    this.state = {}
  }

  componentDidMount () {

  }

  /**
     * Render MyBattles component
     */
  render () {
    return (
      <div className='my-battles-wrapper'>
        <h1 className="title">
          <Trans>myBattles</Trans>
        </h1>
      </div>
    )
  }
}

export default MyBattles
