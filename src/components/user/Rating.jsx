/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import Loader from '../global/Loader'
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Image, Transformation } from 'cloudinary-react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

/**
 * Rating component
 *
 * @param setNotify
 * @param cloudName
 *
 * @returns {*}
 * @constructor
 */
const Rating = ({ setNotify, cloudName }) => {
  const { t } = useTranslation()
  const [users, setUsers] = useState(null)
  const [isFirstLoad, setFirstLoad] = useState(true)
  const [list, setList] = useState([])
  const listWrapperRef = useRef(null)
  const [isDisplayToTop, setDisplayToTop] = useState(false)
  const [isHasMore, setIsHasMore] = useState(true)
  const [lastUserIndex, setLastUserIndex] = useState(-1)

  /**
	 * Load more rows
	 *
	 * @param array
	 */
  const loadMore = (array) => {
    let lastIndex = 0
    let newList = []

    if (array.length) {
      let counter = 0

      array.forEach((user, index) => {
        if (index <= lastUserIndex) {
          return
        }

        if (counter <= 20) {
          newList.push(
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Image cloudName={cloudName} publicId={user.avatar}>
                  <Transformation height="60" fetchFormat="auto" width="45" gravity='face' crop="fill" />
                </Image>
              </td>
              <td>{user.name + ' ' + user.surname}</td>
              <td>{user.battles.length}</td>
              <td>{user.rating}</td>
            </tr>
          )

          counter++
          lastIndex = index
        } else {
          return false
        }
      })

      setLastUserIndex(lastIndex)
      setList([...list, ...newList])
      setIsHasMore(lastUserIndex !== array.length - 1)
    }
  }

  /**
	 * Fetch all users data from db
	 */
  const fetchUsers = () => {
    const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

    axios.get(serverApiPath + '/api/getAllUsers').then(({ data }) => {
      const sortedUsers = data.sort((a, b) => (a.rating < b.rating) ? 1 : -1)
      setUsers(sortedUsers)

      if (isFirstLoad) {
        loadMore(sortedUsers)
        setFirstLoad(false)
      }
    }).catch(() => {
      setUsers([])
      setNotify('fetchingDataError', 'error')
    })
  }

  if (users === null) {
    fetchUsers()
    return <Loader text='dataIsLoading'/>
  } else if (!users.length) {
  	return 'empty'
  }

  /**
	 * Scroll list handler
	 *
	 * @param e
	 */
  const scrollList = (e) => {
    const listWrapper = e.target

    if (isDisplayToTop !== (listWrapper.scrollTop > 100)) {
      setDisplayToTop(listWrapper.scrollTop > 100)
    }

    if (listWrapper.scrollHeight <= Math.ceil(listWrapper.scrollTop + listWrapper.clientHeight + 1) && isHasMore) {
      loadMore(users)
    }
  }

  return (
    <div className="rating-wrapper" onScroll={scrollList} ref={listWrapperRef}>
      <table className="rating-table">
        <caption>{t('usersRating')}</caption>
        <thead>
          <tr>
            <th>№</th>
            <th>{t('Photo')}</th>
            <th>{t('Name')}</th>
            <th>{t('Battles')}</th>
            <th>{t('Likes')}</th>
          </tr>
        </thead>
        <tbody>
				  {list}
          {isHasMore && <tr><td colSpan="5"><Loader/></td></tr>}
        </tbody>
      </table>
    </div>
  )
}

Rating.propTypes = {
  setNotify: PropTypes.func,
  cloudName: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
  	cloudName: state.app.cloudinaryCloudName
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Rating))