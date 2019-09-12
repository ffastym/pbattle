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
import PrivacyPolicy from './global/PrivacyPolicy'
import Nav from './global/Nav'
import PropTypes from 'prop-types'
import Rating from './user/Rating'
import Notifications from './global/Notifications'
import React, { Component } from 'react'
import url from '../config/url'
import Registration from './global/Registration'
import NewBattle from './battle/NewBattle'
import CookiesBanner from './global/CookiesBanner'
import userActions from '../actions/userActions'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import LogIn from './global/LogIn'
import localStorageHelper from '../api/localStorageHelper'
import BattleView from './battle/BattleView'
import appActions from '../actions/appActions'
import ContactUs from './global/ContactUs'
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
    window.addEventListener('click', (e) => {
      if (this.props.isNavActive && !e.target.classList.contains('menu')) {
        this.props.closeNav()
      }
    })

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
        <Nav/>
        <main className='main'>
          <Switch>
            <Route exact path={url.home} render={() => (<Home/>)}/>
            <Route exact path={url.registration} render={() => (<Registration/>)}/>
            <Route exact path={url.rating} render={() => (<Rating/>)}/>
            <Route exact path={url.myBattles} render={() => (<MyBattles/>)}/>
            <Route exact path={url.notifications} render={() => (<Notifications/>)}/>
            <Route exact path={url.profile} render={() => (<Profile/>)}/>
            <Route exact path={url.battle} render={() => (<BattleView/>)}/>
            <Route exact path={url.contactUs} render={() => (<ContactUs/>)}/>
            <Route exact path={url.newBattle} render={() => (<NewBattle/>)}/>
            <Route exact path={url.privacyPolicy} render={() => (<PrivacyPolicy/>)}/>
            <Route component={NotFound}/>
          </Switch>
        </main>
        <Footer/>
        <aside>
          {this.props.isShowNotify && <Notify/>}
          <LogIn/>
        </aside>
        {!this.props.isAcceptCookies && <CookiesBanner/>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isShowNotify: !!state.notify.message,
    isNavActive: state.app.isNavActive,
    isAcceptCookies: state.app.isAcceptCookies
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
    },

    /**
     * Close nav on any click
     */
    closeNav: () => {
      dispatch(appActions.toggleMenu(false))
    }
  }
}

App.propTypes = {
  signIn: PropTypes.func,
  isShowNotify: PropTypes.bool,
  isNavActive: PropTypes.bool,
  isAcceptCookies: PropTypes.bool,
  closeNav: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
