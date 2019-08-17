/**
 * @author Yuriy Matviyuk
 */
import Footer from './global/Footer'
import Header from './global/Header'
import Home from './main/Home'
import MyBattles from './battle/MyBattles'
import NotFound from './static/NotFound'
import Notify from './global/Notify'
import Profile from './user/Profile'
import PropTypes from 'prop-types'
import Rating from './user/Rating'
import Notifications from './global/Notifications'
import React, { Component } from 'react'
import url from '../config/url'
import Registration from './global/Registration'
import NewBattle from './battle/NewBattle'
import userActions from '../actions/userActions'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import LogIn from './global/LogIn'
import localStorageHelper from '../api/localStorageHelper'
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

    localStorageHelper.signIn() // Sign into account by creds fron local storage
    this.state = {
    	pageClassName: this.getPageClassName(props.location)
    }

    this.getPageClassName = this.getPageClassName.bind(this)
  }

  getPageClassName (location) {
    let pathKeys = location.pathname.split('/')
    let pageClassName = ''

    pathKeys.shift()

    pathKeys.forEach(val => {
      if (val) {
        pageClassName += ' ' + val
      }
    })

    if (!pageClassName) {
      pageClassName = ' home'
    }

    return pageClassName
  }

  componentDidMount () {
    this.props.history.listen((location) => {
      this.setState({
        pageClassName: this.getPageClassName(location)
      })
    })
  }

  /**
     * Render App component
     *
     * @returns {*}
     */
  render () {
    return (
      <div className={'app-wrapper' + this.state.pageClassName}>
        <Header/>
        {/* <Nav/> */}
        <main className='main'>
          <Switch>
            <Route exact path={url.home} render={() => (<Home/>)}/>
            <Route exact path={url.registration} render={() => (<Registration/>)}/>
            <Route exact path={url.rating} render={() => (<Rating/>)}/>
            <Route exact path={url.myBattles} render={() => (<MyBattles/>)}/>
            <Route exact path={url.notifications} render={() => (<Notifications/>)}/>
            <Route exact path={url.profile + ':user_id'} render={() => (<Profile/>)}/>
            <Route exact path={url.newBattle} render={() => (<NewBattle/>)}/>
            <Route component={NotFound}/>
          </Switch>
        </main>
        <Footer/>
        <aside>
          {this.props.isShowNotify && <Notify/>}
          <LogIn/>
        </aside>
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
  isShowNotify: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
