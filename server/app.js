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
import userRequest from './api/axios/user'
import appRequest from './api/axios/app'
import notification from './middleware/push-notifications'
import battleRequest from './api/axios/battle'
import io from './api/io'
import notify from './middleware/app-notifications'
import url from '../src/config/url'
import renderer from './middleware/renderer'

const app = express()
const PORT = 3001
const router = express.Router()

connectToDb()

Object.entries(url).forEach(path => {
  router.get(path, renderer)
})

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

router.post('/removeNotification', userRequest.removeNotification)
router.post('/sendMail', appRequest.sendMail)
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
    let counter = 0

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

      Battle.save().then(data => {
        let newBattle = { ...data }

        newBattle._doc.users.user1.data = allUsers.filter(val => val._doc._id.toString() === authorId)[0]
        notify.battleCreate(newBattle)
        newBattlesIds.push(data._id.toString())

        allUsers.forEach(doc => {
          const docId = doc._id.toString()

          if (docId === authorId || docId === opponentId) {
            doc.battles = [...doc.battles, data._id.toString()]
            doc.save()
          }

          const subscription = doc.subscription

          if (subscription) {
            notification.send(subscription, {
              type: 'NEW_BATTLE',
              name: doc.name + ' ' + doc.surname
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

router.post('/setUserGender', userRequest.setGender)

router.post('/acceptBattles', (req, res) => {
  Models.Battle.find({ _id: { $in: req.body } })
    .populate('users.user2.data')
    .exec((err, battles) => {
      if (err) {
        return res.json({ success: false })
      }

      battles.forEach(battle => {
        battle.active = true
        battle.save().then(() => {
          notify.battleAccept(battle)
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

  Models.User.findOne(userData)
    .select(['+email', '+password'])
    .populate('notifications')
    .exec((err, userDoc) => {
      if (err) {
        return res.json({ success: false, err })
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

router.post('/signIn', userRequest.signIn)

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

router.post('/signUp', userRequest.signUp)
router.post('/getBattle', battleRequest.getBattle)

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

io.listen(app.listen(process.env.PORT || PORT, console.log(`LISTENING ON PORT ${PORT}`)))
