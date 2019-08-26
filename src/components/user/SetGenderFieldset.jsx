/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import notifyActions from '../../actions/notifyActions'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import React, { useState } from 'react'
import user from '../../api/axios/user'
import userActions from '../../actions/userActions'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * SetGenderFieldset component
 *
 * @param setNotify
 * @param setUserGender
 * @param id
 * @param hideLogin
 *
 * @returns {*}
 * @constructor
 */
const SetGenderFieldset = ({ setNotify, setUserGender, id, hideLogin }) => {
  const { t } = useTranslation()
  const [gender, setGender] = useState(null)

  /**
   * When radio button checked
   *
   * @param e
   */
  const changeGender = e => {
    setGender(e.target.value)
  }

  /**
   * Submit chosen gender
   */
  const submitGender = () => {
    user.setGender(id, gender).then(({ data }) => {
      if (data.gender) {
        setUserGender(data.gender)
        hideLogin()
        setNotify('genderChanged', 'success')
      }
    }).catch(() => {
      setNotify('genderNotChanged', 'error')
    })
  }

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="gender"
        name="gender"
        value={gender}
        onChange={changeGender}>
        <FormControlLabel value="male" control={<Radio />} label={t('Male')} />
        <FormControlLabel value="female" control={<Radio />} label={t('Female')} />
      </RadioGroup>
      <Button href=''
        onClick={submitGender}
        disabled={!gender}
        className="primary"
        variant={'contained'}>
        {t('OK')}
      </Button>
    </FormControl>
  )
}

const mapStateToProps = state => {
  return {
    id: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    /**
     * Set message of material UI snackbarredire
     *
     * @param message
     * @param type
     */
    setNotify: (message, type) => {
      dispatch(notifyActions.setMessage(message, type))
    },

    /**
     * Hide login popin
     */
    hideLogin: () => {
      dispatch(appActions.openLogin(false))
    },

    /**
     * Set user gender
     *
     * @param gender
     */
    setUserGender: gender => {
      dispatch(userActions.setGender(gender))
    }
  }
}

SetGenderFieldset.propTypes = {
  setNotify: PropTypes.func,
  setUserGender: PropTypes.func,
  hideLogin: PropTypes.func,
  id: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(SetGenderFieldset)
