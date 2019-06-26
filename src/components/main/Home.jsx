/**
 * @author Yuriy Matviyuk
 */
import React, { Component } from 'react'
import Battle from '../battle/Battle'

/**
 * Home component
 */
class Home extends Component {
  /**
     * Home Constructor
     *
     * @param props
     */
  constructor (props) {
    super(props)

    this.state = {}
  }

  /**
     * Render Home component
     */
  render () {
    return (
      <Battle/>
    )
  }
}

export default Home
