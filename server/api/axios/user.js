import Models from '../../db/Models'
import bcrypt from 'bcrypt'

/**
 * @author Yuriy Matviyuk
 */

const userRequest = {
  signUp (req, res) {
    let userData = req.body
    let email = userData.email

    Models.User.findOne({ email }).select(['+email', '+password']).exec((err, userDoc) => {
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
  }
}

export default userRequest
