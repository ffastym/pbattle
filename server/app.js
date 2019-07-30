/**
 * @author Yuriy Matviyuk
 */
import bodyParser from 'body-parser'
import connectToDb from './db/connectToDb'
import cors from 'cors'
import enforce from 'express-sslify'
import express from 'express'
import Models from './db/Models'
import path from 'path'
import bcrypt from 'bcrypt'
import webpush from 'web-push'
import renderHome from './middleware/renderHome'

webpush.setVapidDetails(
  'mailto: estatico1997@gmail.com',
  'BJxX5LZm--6Ve9KwUwftPVA6bDv8BdYHKk1U-1j8AvV-C__vU-BsSUhaOSlKLosrJo5bMjpQb3WSfURrWIHT2m8',
  'l_XPsqDQQzghXYd68SmscgYUIDSVLdJw7zwjOo7uie8'
)

const app = express()
const PORT = 3001
const router = express.Router()

connectToDb()
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

  Object.entries(opponents).forEach(([opponentId, opponent]) => {
    let Battle = new Models.Battle()

    Battle.gender = opponent.gender
    Battle.author = user.userId
    Battle.users = {
      user1: {
        data: user.userId,
        photo: user.photoId
      },
      user2: {
        data: opponentId,
        photo: opponent.avatar
      }
    }

    const searchCriteria = {
      _id: {
        $in: [user.userId, opponentId]
      }
    }

    const payload = JSON.stringify({
      title: 'Hello!',
      body: 'It works.'
    })

    Battle.save().then(data => {
      Models.User.find(searchCriteria, (err, docs) => {
        if (err) {
          console.log('user saving err ---> ', err)
        }

        docs.forEach(doc => {
          doc.battles = [...doc.battles, data._id]
          doc.save()

          if (doc.subscription) {
            webpush.sendNotification(doc.subscription, payload).catch(e => console.log(e.stack))
          }
        })
      })
    }).catch(err => console.log('battle creation error ---> ', err))
  })

  res.status(200).json({ 'success': true })
})

router.post('/acceptBattles', (req, res) => {
  Models.Battle.find({ _id: { $in: req.body } }).then((battles, err) => {
    if (err) {
      return res.json({ success: false })
    }

    battles.forEach(battle => {
      battle.active = true
      battle.save()
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

  Models.User.findOne(userData, (err, userDoc) => {
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

      return res.json({ success: true })
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
  console.log('test ---> ', 'text');
  Models.User
    .find({ _id: { $nin: req.body.ids } })
    .populate('battles')
    .exec((err, opponents) => {
      if (err) {
        return res.json({ success: false, err })
      }

      return res.json(opponents)
    })
})

router.post('/getUserProfile', (req, res) => {
  Models.User.findOne({ _id: req.body.userId }, (err, userDoc) => {
  	return res.json(err ? userDoc : { success: false })
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
