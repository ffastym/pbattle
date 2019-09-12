import React, { Component } from 'react'
import app from '../../api/axios/app'
import Button from '@material-ui/core/Button'
import { Trans } from 'react-i18next'

/**
 * Contact us component
 */
class ContactUs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isEmptyText: false,
      mailSendSuccess: false,
      mailSendError: false,
      emailWasSend: false
    }

    this.getPageRef = this.getPageRef.bind(this)
    this.scrollBottom = this.scrollBottom.bind(this)
    this.getTextareaRef = this.getTextareaRef.bind(this)
    this.sendMail = this.sendMail.bind(this)
  }

  /**
     * ComponentDidMount method
     */
  componentDidMount () {
    window.addEventListener('resize', this.scrollBottom)
  }

  scrollBottom () {
    this.pageRef.scrollTop = this.pageRef.scrollHeight
  };

  /**
     * Get message field ref
     *
     * @param node
     */
  getTextareaRef (node) {
    this.textArea = node
  };

  /**
     * Send mail method
     */
  sendMail () {
    let message = this.textArea.value

    if (!message) {
      return this.setState({
        isEmptyText: true
      })
    }

    app.sendMail(message).then(res => {
      this.setState({
        mailSendSuccess: res.data.success
      })
    }).catch(() => {
      this.setState({
        mailSendError: true
      })
    })

    this.setState({
      emailWasSend: true,
      isEmptyText: false
    })
  };

  getPageRef (node) {
    this.pageRef = node
  };

  /**
     * Render component method
     *
     * @returns {*}
     */
  render () {
    return (
      <div className="page-content" ref={this.getPageRef}>
        <h1 className='title'>
          <Trans>contactUs</Trans>
        </h1>
        {this.state.emailWasSend ? this.state.mailSendSuccess
          ? <p><Trans>LetterWasSendSuccessfully</Trans></p>
          : this.state.mailSendError
            ? <p>При відправленні листа сталася помилка. Будь ласка, спробуйте пізніше</p>
            : <div className="send-mail-loader">
              <span className="sending-process-message">Надсилаємо повідомлення...</span>
              <span className="loader"/>
            </div>
          : <div>
            <p className='page-description'>
                            Якщо ви помітили помилки в роботі сервісу можете повідомити нам деталі, щоб ми могли швидко їх
                            їх усунути. <br/> Також у цій формі можна написати свої пропозиції щодо вдосконалення сервісу.
                            Ми розглянемо усі варіанти. Можливо, саме Ваша ідея стане ключовою у розвитку ресурсу =)
            </p>
            {this.state.isEmptyText ? <p className="error">Повідомлення не може бути пустим</p> : false}
            <textarea className="mail-text"
              placeholder="Введіть Ваше повідомлення..."
              autoFocus={true}
              ref={this.getTextareaRef}
            />
            <div className="actions buttons">
              <Button href=''
                onClick={this.sendMail}
                className="primary"
                variant={'contained'}>
                <Trans>send</Trans>
              </Button>
            </div>
          </div>}
      </div>
    )
  }
}

export default ContactUs
