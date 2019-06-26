/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import Footer from './global/Footer'
import Header from './global/Header'
import Home from './main/Home'
import NotFound from './static/NotFound'
import Notify from './global/Notify'
import Profile from './user/Profile'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Registration from './global/Registration'
import userActions from '../actions/userActions'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
/**
 * App root component
 */
class App extends Component {
  /**
     * App Constructor
     *
     * @param props
     */
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
    let credentials = localStorage.getItem('credentials')

    if (credentials) {
      axios.post(
        serverApiPath + '/api/logIn',
        JSON.parse(credentials)
      ).then(({ data }) => {
        if (data._id) {
          this.props.signIn(data)
        }
      })
    }
  }

  /**
     * Render App component
     *
     * @returns {*}
     */
  render () {
    return (
      <div className="app-wrapper">
        <Header/>
        {/* <Nav/> */}
        <main className='main'>
          <Switch>
            <Route exact path="/" render={() => (<Home/>)}/>
            <Route exact path="/registration" render={() => (<Registration/>)}/>
            <Route exact path="/profile/:user_id" render={() => (<Profile/>)}/>
            <Route component={NotFound}/>
          </Switch>
        </main>
        <Footer/>
        <aside>
          {this.props.isShowNotify && <Notify/>}
        </aside>
        {/* <TakePhoto/> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isShowNotify: !!state.notify.message
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
        * Set user as logged in
        *
        * @param userData
        */
    signIn: userData => {
      dispatch(userActions.signIn(userData))
    }
  }
}

App.propTypes = {
  signIn: PropTypes.func,
  isShowNotify: PropTypes.bool
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
