import email from '../email'

/**
 * @author Yuriy Matviyuk
 */

const battleRequest = {
  /**
   * Send mail
   *
   * @param req
   * @param res
   */
  sendMail: (req, res) => {
    email.sendEmail(req.body.message, res)
  }
}

export default battleRequest
