/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import battleActions from '../../actions/battleActions'
import Button from '@material-ui/core/Button/index'
import Loader from '../global/Loader'
import NewOpponent from './NewOpponent'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import request from 'superagent'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'
import { Redirect, withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import notifyActions from '../../actions/notifyActions'

/**
 * NewBattle component
 *
 * @param photo
 * @param userId
 * @param cloudPreset
 * @param cloudUrl
 * @param cloudName
 * @param setNotify
 *
 * @returns {*}
 * @constructor
 */
const NewBattle = ({ photo, userId, cloudPreset, cloudUrl, cloudName, setNotify }) => {
  const { t } = useTranslation()
  const [opponent, setOpponent] = useState(null)
  const [isCreated, setAsCreated] = useState(false)
  const [opponents, setOpponents] = useState({})
  const [list, setList] = useState([])
  const [photoId, setPhotoId] = useState(null)
  const [opponentPhoto, setOpponentPhoto] = useState(null)

  let isAddedToList = !!(opponent && opponents[opponent._id])

  if (!photo) {
    return <Redirect to='/new_photo'/>
  }

  const uploadImage = () => {
    setPhotoId('loader')

    let upload = request.post(cloudUrl)
      .field('upload_preset', cloudPreset)
      .field('tags', 'battle')
      .field('folder', 'battle')
      .field('file', photo)

    upload.end((err, response) => {
      if (err) {
        console.log('image upload error ---> ', err)
      } else if (response.body.secure_url !== '') {
        setPhotoId(response.body.public_id)
      }
    })
  }

  if (!photoId) {
    uploadImage()
  }

  const getOpponent = () => {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
    const ids = [...Object.keys(opponents), userId]

    axios.post(serverApiPath + '/api/getOpponent', { ids }).then(({ data }) => {
      setOpponent(data)
      setOpponentPhoto(data.avatar)
    })
  }
  
  const createBattles = () => {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
    const user = { userId, photoId }
    
    axios.post(
      serverApiPath + '/api/requestBattle',
      { opponents, user }
    ).then(({ data }) => {
      if (!data.success) {
        return setNotify(t('battlesCreationErr'), 'error')
      }

      setNotify(t('battlesSuccessfullyCreated'), 'success')
      setAsCreated(true)
    }).catch(err => console.log('new battle request failed ---> ', err))
  }

  if (isCreated) {
    return <Redirect to={'/'}/>
  }

  const removeOpponent = (e) => {
    let newOpponents = { ...opponents }

    delete newOpponents[e.target.dataset.id]

    setOpponents(newOpponents)
  }

  const addOpponent = () => {
    let currOpponents = { ...opponents }

    currOpponents[opponent._id] = opponent
    setOpponents(currOpponents)
  }

  if (!opponent) {
    getOpponent()
  }

  let newList = []

  if (Object.entries(opponents).length !== list.length) {
    Object.entries(opponents).forEach(([id, user]) => {
      newList.push(<NewOpponent user={user} id={id} key={id} removeOpponent={removeOpponent}/>)
    })

    setList(newList)
  }

  return (
    <div className='new-battle-wrapper'>
      <div className="new-battle-photos-wrapper">
        <div className="new-battle-photo">
          {photoId === 'loader'
            ? <span>loading...</span>
            : <Image cloudName={cloudName} publicId={photoId}>
              <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
            </Image>}
        </div>
        <span className='vs'>{t('VS')}</span>
        <div className="new-battle-photo">
          {opponentPhoto
            ? <Image cloudName={cloudName} publicId={opponentPhoto}>
              <Transformation height="500" fetchFormat="auto" width="360" gravity='face' crop="fill" />
            </Image>
            : <Loader/>}
        </div>
      </div>
      <div className="actions-toolbar">
        <Button href='' onClick={addOpponent} variant="outlined" color="primary" disabled={isAddedToList}>
          {t(isAddedToList ? 'addedToList' : 'addToList')}
        </Button>
        <Button href='' onClick={getOpponent} variant={'outlined'} color='secondary'>
          {t('next')}
        </Button>
      </div>
      <div className="opponents-wrapper">
        {list.length
          ? <ul className='opponents-list'>{list}</ul>
          : <span className='empty'>{t('PleaseAddOpponents')}</span>}
      </div>
      {!!list.length &&
        <Button href='' variant={'contained'} color='primary' onClick={createBattles}>
          {t('createBattles')}
        </Button>}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    photo: state.battle.newPhoto,
    userId: state.user.id,
    cloudPreset: state.app.cloudinaryUploadPreset,
    cloudUrl: state.app.cloudinaryUploadUrl,
    cloudName: state.app.cloudinaryCloudName
  }
}

NewBattle.propTypes = {
  photo: PropTypes.string,
  userId: PropTypes.string,
  cloudPreset: PropTypes.string,
  cloudUrl: PropTypes.string,
  cloudName: PropTypes.string,
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
