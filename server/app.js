/**
 * @author Yuriy Matviyuk
 */
import bodyParser from 'body-parser'
import connectToDb from './db/connectToDb'
import dotenv from 'dotenv'
import cors from 'cors'
import enforce from 'express-sslify'
import express from 'express'
import Models from './db/Models'
import path from 'path'
import bcrypt from 'bcrypt'
import webpush from 'web-push'
import renderHome from './middleware/renderHome'

const app = express()
const PORT = 3001
const router = express.Router()

dotenv.config()
connectToDb()
webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)
router.get('/', renderHome)

app.use(cors())
app.use(bodyParser.json())
app.use(router)
app.use('/api', router)
app.use(express.static(path.resolve(__dirname, '..', 'build')))

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({
    trustXForwardedHostHeader: true,
    trustProtoHeader: true
  }))
}

router.post('/requestBattle', (req, res) => {
  const opponents = req.body.opponents
  const user = req.body.user
  const authorId = user.userId
  const opponentsIds = Object.keys(opponents)

  Models.User.find({ _id: { $in: [authorId, ...opponentsIds] } }, (err, allUsers) => {
    if (err) {
      console.log('users fetching err ---> ', err)
    }

    let newBattlesIds = []
    let counter = 0;

    Object.entries(opponents).forEach(([opponentId, opponent]) => {
      let Battle = new Models.Battle()

      Battle.gender = opponent.gender
      Battle.author = authorId
      Battle.users = {
        user1: {
          data: authorId,
          photo: user.photoId
        },
        user2: {
          data: opponentId,
          photo: opponent.avatar
        }
      }

      const payload = JSON.stringify({
        title: 'Новий Батл',
        vibrate: [100, 50, 100],
        icon: 'https://res.cloudinary.com/ddo4y69ih/image/upload/v1565638351/battle/01_tlkzbm.jpg',
        body: 'Вам надіслати запит на батл. Торкніться щоб переглянути'
      })

      Battle.save().then(data => {
        newBattlesIds.push(data._id.toString())

        allUsers.forEach(doc => {
          const docId = doc._id.toString()

          if (docId === authorId || docId === opponentId) {
            doc.battles = [...doc.battles, data._id.toString()]
            doc.save()
          }

          if (doc.subscription) {
            webpush.sendNotification(doc.subscription, payload)
              .then(res => {
                console.log('notification sending response ---> ', res)
              }).catch(err => {
                console.log('notification sending error ---> ', err)
              })
          }
        })

        if (++counter >= opponentsIds.length) {
          return res.json({
            success: true,
            newBattlesIds
          })
        }
      })
    })
  })
})

router.post('/rejectBattles', (req, res) => {
  Models.Battle.find({ _id: { $in: req.body } }).remove().then((battles, err) => {
    return res.json({ success: !err })
  })
})

router.post('/setAvatar', (req, res) => {
  const data = req.body

  Models.User.findOneAndUpdate(
    { _id: data.id },
    { $set: { avatar: data.photo } },
    (err) => {
      return res.json({ success: !err })
    }
  )
})

router.post('/acceptBattles', (req, res) => {
  Models.Battle.find({ _id: { $in: req.body } }).then((battles, err) => {
    if (err) {
      return res.json({ success: false })
    }

    battles.forEach(battle => {
      battle.active = true
      battle.save().then(() => {
        Models.User.findOne({ _id: battle.author }, (err, userDoc) => {
          if (err) {
            return console.log('Notification sending error ---> ', err)
          }

          if (userDoc.subscription) {
            const payload = JSON.stringify({
              title: 'Батл прийнято',
              vibrate: [100, 50, 100],
              icon: 'https://res.cloudinary.com/ddo4y69ih/image/upload/v1565638351/battle/01_tlkzbm.jpg',
              body: 'Ваш запит на батл прийнято. Торкніться щоб перейти до батлу'
            })

            webpush.sendNotification(userDoc.subscription, payload)
              .then(res => {
                console.log('notification sending response ---> ', res)
              }).catch(err => {
                console.log('notification sending error ---> ', err)
              })
          }
        })
      })
    })

    return res.json(battles)
  })
})

router.post('/saveSubscription', (req, res) => {
  const _id = req.body.id
  const subscription = req.body.subscription

  Models.User.findOneAndUpdate({ _id }, { $set: { subscription } }, (err) => {
    if (err) {
      return console.log('Saving subscription error ---> ', err)
    }

    return res.json({ success: true })
  })
})

router.post('/logIn', (req, res) => {
  let userData = req.body

  Models.User.findOne(userData).select(['+email', '+password']).exec((err, userDoc) => {
    if (err) {
      return console.log('Login error ---> ', err)
    }

    return res.json(userDoc)
  })
})

router.post('/likeBattlePhoto', (req, res) => {
  const _id = req.body.battleId

  Models.Battle
    .findOne({ _id })
    .populate('users.user1.data')
    .populate('users.user2.data')
    .exec((err, battle) => {
      if (err) {
        return res.json({ success: false })
      }

      const index = 'user' + req.body.index
      const likedUser = battle.users[index]

      likedUser.likesQty++
      likedUser.data.rating++
      likedUser.data.save()
      battle.save()

      Models.User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { likedBattles: _id } },
        { useFindAndModify: false }
      ).then(() => {
        return res.json({ success: true })
      }).catch(err => {
        console.log('like battle err ---> ', err)

        return res.json({ success: false })
      })
    })
})

router.get('/getAllUsers', (req, res) => {
  Models.User.find((err, data) => {
    return res.json(
      err ? { success: false } : data
    )
  })
})

router.post('/signIn', (req, res) => {
  let userData = req.body
  let email = userData.email

  Models.User.findOne({ email }).select(['+email', '+password']).exec((err, userDoc) => {
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
})

router.post('/signUp', (req, res) => {
  let userData = req.body
  let email = userData.email

  Models.User.findOne({ email }).select(['+email', '+password']).exec((err, userDoc) => {
    if (err) {
      console.log('Registration error ---> ', err)

      return res.json({ err: 'registrationErr' })
    }

    if (userDoc) {
      return res.json({ err: 'emailExist' })
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
})

router.post('/getOpponents', (req, res) => {
  const reqBody = req.body

  Models.User
    .find({
      _id: { $nin: reqBody.ids },
      avatar: { $exists: true },
      gender: reqBody.gender
    }).populate('battles')
    .exec((err, opponents) => {
      if (err) {
        return res.json({ success: false, err })
      }

      return res.json(opponents)
    })
})

router.post('/getUserProfile', (req, res) => {
  Models.User.findOne({ _id: req.body.userId }, (err, userDoc) => {
  	return res.json(err ? { success: false } : userDoc)
  })
})

router.post('/getUserBattles', (req, res) => {
  Models.Battle.find({ _id: { $in: req.body.ids } }, (err, battles) => {
    if (err) {
      console.log('Fetching user battles error ---> ', err)

      return res.json({ success: false })
    }

    return res.json(battles)
  })
})

router.post('/signUp', (req, res) => {
  let userData = req.body
  let email = userData.email

  Models.User.findOne({ email }).select(['+email', '+password']).exec((err, userDoc) => {
    if (err) {
      console.log('Registration error ---> ', err)

      return res.json({ err: 'registrationErr' })
    }

    if (userDoc) {
      return res.json({ err: 'emailExist' })
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
})

router.get('/getActiveBattles', (req, res) => {
  Models.Battle
    .find({ active: true })
    .populate('users.user1.data')
    .populate('users.user2.data')
    .exec((err, battles) => {
      if (err) {
        console.log('Fetching active battles error ---> ', err)

        return res.json({ success: false })
      }

      return res.json(battles)
    })
})

app.listen(process.env.PORT || PORT, console.log(`LISTENING ON PORT ${PORT}`))
