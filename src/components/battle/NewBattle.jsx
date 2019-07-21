/**
 * @author Yuriy Matviyuk
 */
import battle from '../../api/axios/battle'
import battleActions from '../../actions/battleActions'
import Button from '@material-ui/core/Button'
import cloudinary from '../../api/cloudinary'
import Loader from '../global/Loader'
import NewOpponent from './NewOpponent'
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import url from '../../config/url'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'
import { Redirect, withRouter } from 'react-router-dom'
import { Trans } from 'react-i18next'

/**
 * NewBattle component
 */
class NewBattle extends Component {
  /**
  * NewBattle Constructor
  *
  * @param props
  */
  constructor (props) {
    super(props)

    this.state = {
      opponent: null,
      opponents: {},
      allOpponents: [],
      list: [],
      photoId: null,
      opponentPhoto: null,
      isCreated: false,
      photoPosX: 0,
      photoPosY: 0,
      isDropZoneActive: false
    }

    this.getRandomOpponent = this.getRandomOpponent.bind(this)
    this.getOpponents = this.getOpponents.bind(this)
    this.createBattles = this.createBattles.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.removeOpponent = this.removeOpponent.bind(this)
    this.addOpponent = this.addOpponent.bind(this)
    this.createList = this.createList.bind(this)
    this.startMove = this.startMove.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.endMove = this.endMove.bind(this)
  }

  componentDidMount () {
    if (!this.state.photoId && this.props.photo) {
      this.uploadImage()
    } else if (!this.props.photo) {
      return
    }

    this.getOpponents()
  }

  /**
   * Get random opponent for battle from all fetched users
   *
   * @param data
   * @returns {boolean}
   */
  getRandomOpponent (data) {
    if (!data || !data.length) {
      return false
    }

    const opponents = Object.keys(this.state.opponents)
    const users = data.filter(user => !opponents.includes(user._id))
    const qty = users.length
    const index = Math.floor(Math.random() * qty)
    const currOpponent = users[index]

    this.setState({
      allOpponents: data,
      opponent: currOpponent,
      opponentPhoto: currOpponent.avatar
    })
  }

  /**
   * Fetch all users from DB
   */
  getOpponents () {
    const state = this.state
    const ids = [...Object.keys(state.opponents), this.props.userId]

    battle.getOpponents(ids).then(({ data }) => {
      this.getRandomOpponent(data)
    })
  }

  /**
   * Create new battle request with all selected opponents
   */
  createBattles () {
    const state = this.state
    const user = { userId: this.props.userId, photoId: state.photoId }

    battle.requestBattles(this.state.opponents, user).then(({ data }) => {
      if (!data.success) {
        return this.props.setNotify('battlesCreationErr', 'error')
      }

      this.props.setNotify('battlesSuccessfullyCreated', 'success')
      this.setState({ isCreated: true })
    }).catch(err => console.log('new battle request failed ---> ', err))
  }

  /**
   * Upload photo to the cloudinary cloud
   */
  uploadImage () {
    this.setState({ photoId: 'loader' })

    cloudinary.upload(this.props.photo).end((err, response) => {
      if (err) {
        console.log('image upload error ---> ', err)
      } else if (response.body.secure_url !== '') {
        this.setState({ photoId: response.body.public_id })
      }
    })
  }

  /**
   * Remove user from list of selected for battle users
   *
   * @param e
   */
  removeOpponent (e) {
    let newOpponents = { ...this.state.opponents }
    delete newOpponents[e.target.dataset.id]
    this.setState({ opponents: newOpponents }, this.createList)
  }

  /**
   * Add user to list of opponents
   */
  addOpponent () {
    const state = this.state
    let currOpponents = { ...state.opponents }

    if (Object.keys(currOpponents).length === 10) {
      return this.props.setNotify('cantCreateMoreThan10Battles', 'error')
    }

    currOpponents[state.opponent._id] = state.opponent
    this.setState({ opponents: currOpponents }, () => {
      this.createList()
      this.getRandomOpponent(this.state.allOpponents)
    })
  }

  /**
   * Create list (content of selected opponents)
   */
  createList () {
    let list = []
    const state = this.state

    Object.entries(state.opponents).forEach(([id, user]) => {
      list.push(<NewOpponent user={user} id={id} key={id} removeOpponent={this.removeOpponent}/>)
    })

    this.setState({ list })
  }

  /**
   * Opponent photo drag start
   * 
   * @param e
   */
  startMove (e) {
    this.setState({
      photoPosX: e.nativeEvent.touches[0].clientX,
      photoPosY: e.nativeEvent.touches[0].clientY
    })

    e.currentTarget.style.position = 'absolute'
    e.currentTarget.classList.add('no-transition')
  }

  /**
   * Trigger when opponent photo is drag
   *
   * @param e
   */
  handleMove (e) {
    const element = e.currentTarget
    const elementBoundingBox = element.getBoundingClientRect()
    const elementTopPos = elementBoundingBox.top + elementBoundingBox.height
    const opponentsWrapperTopPos = this.opponentsWrapperRef.getBoundingClientRect().top

    if (elementTopPos > opponentsWrapperTopPos) {
      this.opponentsWrapperRef.classList.add('active')
      element.classList.add('add')
    } else if (elementBoundingBox.top < -30) {
      element.classList.add('del')
    } else {
      this.opponentsWrapperRef.classList.remove('active')
      element.classList.remove('add', 'del')
    }
    
    element.style.top = (e.nativeEvent.touches[0].clientY - this.state.photoPosY) + 'px'
    element.style.right = (this.state.photoPosX - e.nativeEvent.touches[0].clientX) + 'px'
  }

  /**
   * When opponent photo was dropped
   *
   * @param e
   */
  endMove (e) {
    const element = e.currentTarget
    const elementBoundingBox = element.getBoundingClientRect()
    const elementTopPos = elementBoundingBox.top + elementBoundingBox.height
    const opponentsWrapperTopPos = this.opponentsWrapperRef.getBoundingClientRect().top

    if (elementBoundingBox.top < -50) {
      this.setState({ opponentPhoto: null })
      this.getRandomOpponent(this.state.allOpponents)
    } else if (elementTopPos > opponentsWrapperTopPos) {
      if (Object.keys(this.state.opponents).length < 10) {
        this.setState({ opponentPhoto: null })
      } else {
        element.classList.remove('no-transition')
      }
      this.addOpponent()
    } else {
      element.classList.remove('no-transition')
    }

    element.style.top = 0
    element.style.right = 0

    this.opponentsWrapperRef.classList.remove('active')
    element.classList.remove('add', 'del')
  }

  componentWillUnmount () {
    this.props.setNewPhoto(null)
  }

  /**
  * Render NewBattle component
  */
  render () {
    if (!this.props.photo) {
      return <Redirect to={url.newPhoto}/>
    } else if (this.state.isCreated) {
      return <Redirect to={url.home}/>
    } else if (this.state.photoId === 'loader') {
      return <Loader text='uploadPhoto...' />
    }

    const list = this.state.list

    return (
      <div className='new-battle-wrapper'>
        <h1 className="title">
          <Trans>newBattle</Trans>
        </h1>
        <div className="new-battle-photos-wrapper">
          <div className="new-battle-photo">
            <Image cloudName={cloudinary.cloudName} publicId={this.state.photoId}>
              <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
            </Image>
          </div>
          <span className='vs'>
            <Trans>VS</Trans>
          </span>
          <div className="new-battle-photo opponent"
            onTouchStart={this.startMove}
            onTouchMove={this.handleMove}
            onTouchEnd={this.endMove}>
            {this.state.opponentPhoto
              ? <Image cloudName={cloudinary.cloudName} publicId={this.state.opponentPhoto}>
                <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
              </Image>
              : <Loader/>}
          </div>
        </div>
        <div className='opponents-wrapper' ref={node => { this.opponentsWrapperRef = node }}>
          {list.length
            ? <ul className='opponents-list'>{list}</ul>
            : <span className='empty'><Trans>PleaseAddOpponents</Trans></span>}
        </div>
        <Button href='' variant={'contained'} disabled={!list.length} color='primary' onClick={this.createBattles}>
          <Trans>createBattles</Trans>
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    photo: state.battle.newPhoto,
    userId: state.user.id
  }
}

NewBattle.propTypes = {
  photo: PropTypes.string,
  userId: PropTypes.string,
  setNotify: PropTypes.func,
  setNewPhoto: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    /**
		 * Set photo for new battle
		 *
		 * @param photo
		 */
    setNewPhoto: (photo) => {
      dispatch(battleActions.setNewPhoto(photo))
    },

    /**
		 * Set message of material UI snackbar
		 *
		 * @param message
		 * @param type
		 */
    setNotify: (message, type) => {
      dispatch(notifyActions.setMessage(message, type))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewBattle))
