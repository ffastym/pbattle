/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import Footer from './global/Footer'
import Header from './global/Header'
import Home from './main/Home'
import MyBattles from './user/MyBattles'
import NotFound from './static/NotFound'
import Notify from './global/Notify'
import Profile from './user/Profile'
import PropTypes from 'prop-types'
import Rating from './user/Rating'
import React, { Component } from 'react'
import url from '../config/url'
import Registration from './global/Registration'
import TakePhoto from './global/TakePhoto'
import NewBattle from './battle/NewBattle'
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

    this.state = {
    	pageClassName: this.getPageClassName(props.location)
		}
  }

  getPageClassName = (location) => {
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
      <div className={'app-wrapper' + this.state.pageClassName}>
        <Header/>
        {/* <Nav/> */}
        <main className='main'>
          <Switch>
            <Route exact path={url.home} render={() => (<Home/>)}/>
            <Route exact path={url.registration} render={() => (<Registration/>)}/>
            <Route exact path={url.rating} render={() => (<Rating/>)}/>
            <Route exact path={url.newPhoto} render={() => (<TakePhoto/>)}/>
            <Route exact path={url.myBattles} render={() => (<MyBattles/>)}/>
            <Route exact path={url.profile} render={() => (<Profile/>)}/>
            <Route exact path={url.newBattle} render={() => (<NewBattle/>)}/>
            <Route component={NotFound}/>
          </Switch>
        </main>
        <Footer/>
        <aside>
          {this.props.isShowNotify && <Notify/>}
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
