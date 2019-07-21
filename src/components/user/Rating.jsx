/**
 * @author Yuriy Matviyuk
 */
import user from '../../api/axios/user'
import Loader from '../global/Loader'
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import RatingRow from './RatingRow'

/**
 * Rating component
 *
 * @param setNotify
 *
 * @returns {*}
 * @constructor
 */
const Rating = ({ setNotify }) => {
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
            <RatingRow user={user} index={index} key={index}/>
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
    user.getAllUsers().then(({ data }) => {
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
  setNotify: PropTypes.func
}

const mapStateToProps = () => {
  return {}
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
