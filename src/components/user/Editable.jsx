/**
 * @author Yuriy Matviyuk
 */
import React, {useState} from 'react'
import { Image, Transformation } from 'cloudinary-react'
import PropTypes from 'prop-types'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cloudinary from '../../api/cloudinary'
import userActions from '../../actions/userActions'
import Button from '@material-ui/core/Button'
import url from '../../config/url'

/**
 * Editable component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Editable = (props) => {
  const { t } = useTranslation()
  const [change, setChangePhoto] = useState(false)
  const address = props.country ? props.country + props.city ? ', ' + props.city : '' : ''
  const profilePhoto = props.avatar

  if (change) {
    return <Redirect to={url.newPhoto}/>
  }
  
  if (profilePhoto && profilePhoto.temp) {
    console.log('test ---> ', 'temp exist')
  }

  return (
    <div className='user-profile'>
      <div className="profile-photo-wrapper">
        <span className="action edit" onClick={() => setChangePhoto(true)}/>
        {profilePhoto
          ? <Image cloudName={cloudinary.cloudName} publicId={profilePhoto}>
            <Transformation height="200" fetchFormat="auto" width="150" gravity='face' crop="fill" />
          </Image>
          : <img src='/images/profile.png'/> }
      </div>
      <h1 className="name">{props.name + ' ' + props.surname}</h1>
      {!!props.age && <div className="age">{props.age + t('years')}</div>}
      <div className="gender">{props.gender}</div>
      {!!address && <div className="address">{address}</div>}
      <Button href=''
        onClick={props.logOut}
        className="primary"
        variant={'contained'}>
        {t('logOut')}
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    avatar: state.user.avatar,
    name: state.user.name,
    surname: state.user.surname,
    gender: state.user.gender,
    age: state.user.age,
    country: state.user.country,
    city: state.user.city
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => {
      return dispatch(userActions.logOut())
    }
  }
}

Editable.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user_id: PropTypes.string.isRequired
    })
  }),
  userId: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  surname: PropTypes.string,
  gender: PropTypes.string,
  age: PropTypes.number,
  country: PropTypes.string,
  city: PropTypes.string,
  logOut: PropTypes.func
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Editable))
