import Models from '../../db/Models'

/**
 * @author Yuriy Matviyuk
 */

const battleRequest = {
  /**
   * Get battle by id
   *
   * @param req
   * @param res
   */
  getBattle: (req, res) => {
    Models.Battle.findOne({ _id: req.body.id })
      .populate('users.user1.data')
      .populate('users.user2.data')
      .exec((err, battle) => {
        return res.json({ success: !err, battle })
      })
  }
}

export default battleRequest
