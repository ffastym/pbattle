/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import battleActions from '../../actions/battleActions'
import Button from '@material-ui/core/Button/index'
import Loader from '../global/Loader'
import PropTypes from 'prop-types'
import NewOpponent from './NewOpponent'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * NewBattle component
 *
 * @param photo

 * @returns {*}
 * @constructor
 */
const NewBattle = ({ photo }) => {
  const { t } = useTranslation()
  const [opponent, setOpponent] = useState(null)
  const [opponents, setOpponents] = useState({})
  const [list, setList] = useState([])
  const [opponentPhoto, setOpponentPhoto] = useState(null)

  let isAddedToList = !!(opponent && opponents[opponent._id])

  if (!photo) {
    return <Redirect to='/new_photo'/>
  }

  const getOpponent = () => {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

    axios.post(serverApiPath + '/api/getOpponent').then(({ data }) => {
      setOpponent(data)
      setOpponentPhoto(data.photos[0])
    })
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
          <img src={photo} alt=''/>
        </div>
        <span className='vs'>{t('VS')}</span>
        <div className="new-battle-photo">
          {opponentPhoto ? <img src={opponentPhoto} alt=''/> : <Loader/>}
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
        <Button href='' variant={'contained'} color='primary'>
          {t('createBattles')}
        </Button>}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    photo: state.battle.newPhoto
  }
}

NewBattle.propTypes = {
  photo: PropTypes.string
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
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewBattle))
