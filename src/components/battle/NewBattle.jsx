/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import battleActions from '../../actions/battleActions'
import Button from '@material-ui/core/Button'
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
import cloudinary from '../../api/cloudinary'

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
      isCreated: false
    }

    this.getRandomOpponent = this.getRandomOpponent.bind(this)
    this.getOpponents = this.getOpponents.bind(this)
    this.createBattles = this.createBattles.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.removeOpponent = this.removeOpponent.bind(this)
    this.addOpponent = this.addOpponent.bind(this)
    this.createList = this.createList.bind(this)
  }

  componentDidMount () {
    if (!this.state.photoId && this.props.photo) {
      this.uploadImage()
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

    const qty = data.length
    const index = Math.floor(Math.random() * qty)
    const currOpponent = data[index]

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
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
    const state = this.state
    const ids = [...Object.keys(state.opponents), this.props.userId]

    axios.post(serverApiPath + '/api/getOpponents', { ids }).then(({ data }) => {
      this.getRandomOpponent(data)
    })
  }

  /**
   * Create new battle request with all selected opponents
   */
  createBattles () {
    const state = this.state
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
    const user = { userId: this.props.userId, photoId: state.photoId }

    axios.post(
      serverApiPath + '/api/requestBattle',
      { opponents: state.opponents, user }
    ).then(({ data }) => {
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
   * Remove user from list of selected fo battle users
   *
   * @param e
   */
  removeOpponent (e) {
    let newOpponents = { ...this.state.opponents }

    delete newOpponents[e.target.dataset.id]

    this.setState({ opponents: newOpponents })
  }

  /**
   * Add user to list of opponents
   */
  addOpponent () {
    const state = this.state
    let currOpponents = { ...state.opponents }

    currOpponents[state.opponent._id] = state.opponent
    this.setState({ opponents: currOpponents }, this.createList)
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

    let isAddedToList = !!(this.state.opponent && this.state.opponents[this.state.opponent._id])
    const list = this.state.list

    return (
      <div className='new-battle-wrapper'>
        <div className="new-battle-photos-wrapper">
          <div className="new-battle-photo">
            <Image cloudName={cloudinary.cloudName} publicId={this.state.photoId}>
              <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
            </Image>
          </div>
          <span className='vs'>
            <Trans>VS</Trans>
          </span>
          <div className="new-battle-photo">
            {this.state.opponentPhoto
              ? <Image cloudName={cloudinary.cloudName} publicId={this.state.opponentPhoto}>
                <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
              </Image>
              : <Loader/>}
          </div>
        </div>
        <div className="actions-toolbar">
          <Button href='' onClick={this.addOpponent} variant="outlined" color="primary" disabled={isAddedToList}>
            <Trans>{isAddedToList ? 'addedToList' : 'addToList'}</Trans>
          </Button>
          <Button href='' onClick={() => { this.getRandomOpponent(this.state.allOpponents) }} variant={'outlined'} color='secondary'>
            <Trans>next</Trans>
          </Button>
        </div>
        <div className="opponents-wrapper">
          {list.length
            ? <ul className='opponents-list'>{list}</ul>
            : <span className='empty'><Trans>PleaseAddOpponents</Trans></span>}
        </div>
        {!!list.length &&
				<Button href='' variant={'contained'} color='primary' onClick={this.createBattles}>
				  <Trans>createBattles</Trans>
				</Button>}
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
  setNotify: PropTypes.func
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
