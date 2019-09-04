import Models from '../../db/Models'
import bcrypt from 'bcrypt'

/**
 * @author Yuriy Matviyuk
 */

const userRequest = {
  /**
   * Set user gender
   *
   * @param req
   * @param res
   */
  setGender: (req, res) => {
    const data = req.body
    const gender = data.gender

    Models.User.findOneAndUpdate(
      { _id: data.id },
      { $set: { gender } },
      (err) => {
        return res.json({ success: !err, gender })
      }
    )
  },

  /**
   * Remove user notification
   *
   * @param req
   * @param res
   */
  removeNotification (req, res) {
    let data = req.body

    Models.Notification.remove({ _id: data.notificationId }).then(() => {
      Models.User.updateOne(
        { _id: data.userId },
        { $pull: { notifications: data.notificationId } }
      ).then(() => {
        return res.json({ success: true })
      })
    })
  },

  signUp (req, res) {
    let userData = req.body
    let email = userData.email

    Models.User.findOne({ email })
      .select(['+email', '+password'])
      .populate('notifications')
      .exec((err, userDoc) => {
        if (err) {
          console.log('Registration error ---> ', err)

          return res.json({ err: 'registrationErr' })
        }

        if (userDoc) {
          return res.json(userData.isSocial ? userDoc : { err: 'emailExist' })
        }

        let User = new Models.User()
        let result = {}

        delete userData.isSocial

        for (let key in userData) {
          if (!userData.hasOwnProperty(key)) {
            continue
          }

          if (key === 'password') {
            userData[key] = bcrypt.hashSync(userData[key], 10)
          }

          User[key] = userData[key]
        }

        User.gender = 'none'

        User.save().then((data) => {
          return res.json(data)
        }).catch(({ errors }) => {
          result.err = []

          for (let err in errors) {
            if (errors.hasOwnProperty(err)) {
              result.err.push(err)
            }
          }

          return res.json(result)
        })
      })
  },

  /**
   * Get user notifications
   *
   * @param _id
   * @param setNotifications
   *
   * @returns {Promise}
   */
  getNotifications (_id, setNotifications) {
    return Models.User.findOne({ _id }).populate('notifications').exec((err, user) => {
      if (err) {
        console.log('get notifications error ---> ', err)

        return { success: false }
      }

      setNotifications(user.notifications)
    })
  }
}

export default userRequest