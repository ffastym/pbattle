/**
 * @author Yuriy Matviyuk
 */
import mongoose from 'mongoose'

const dbRoute = process.env.NODE_ENV === 'production'
  ? 'mongodb://ffastym:Tt239allo@ds231941.mlab.com:31941/heroku_t1xh1z42'
  : 'mongodb://localhost:27017/battle'

mongoose.connect(dbRoute, { useNewUrlParser: true })

const connectToDb = () => {
  const db = mongoose.connection

  db.once('open', () => console.log('connected to the database'))

  // checks if connection with the database is successful
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}

export default connectToDb
