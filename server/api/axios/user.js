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

  /**
   * Login request (from login popup on front)
   *
   * @param req
   * @param res
   */
  signIn: (req, res) => {
    let userData = req.body
    let email = userData.email

    Models.User.findOne({ email })
      .select(['+email', '+password'])
      .populate('notifications')
      .exec((err, userDoc) => {
        if (err) {
          console.log('Login error ---> ', err)

          return res.json({ err: 'loginErr' })
        }

        if (!userDoc) {
          return res.json({ err: 'wrongEmailOrPassword' })
        }

        if (bcrypt.compareSync(userData.password, userDoc.password)) {
          return res.json(userDoc)
        }
      })
  },

  /**
   * Registration request handler
   *
   * @param req
   * @param res
   */
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

        for (let key in userData) {
          if (!userData.hasOwnProperty(key)) {
            continue
          }

          if (key === 'password') {
            userData[key] = bcrypt.hashSync(userData[key], 10)
          }

          if (userData.isSocial) {
            User.gender = 'none'
            delete userData.isSocial
          }

          User[key] = userData[key]
        }

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
  }
}

export default userRequest
