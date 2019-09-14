/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton, TwitterIcon, TwitterShareButton,
  ViberIcon,
  ViberShareButton, WhatsappIcon, WhatsappShareButton
} from 'react-share'
import { useTranslation } from 'react-i18next'

/**
 * SocialShare component
 *
 * @param url
 *
 * @returns {*}
 * @constructor
 */
const SocialShare = ({ url }) => {
  const { t } = useTranslation()
console.log('test ---> ', url)
  return (
    <div className="share-container">
      <div className="share-in">{t('shareIn')}</div>
      <div className="share-form">
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round/>
        </FacebookShareButton>
        <TelegramShareButton url={url}>
          <TelegramIcon size={32} round/>
        </TelegramShareButton>
        <ViberShareButton url={url}>
          <ViberIcon size={32} round/>
        </ViberShareButton>
        <WhatsappShareButton url={url}>
          <WhatsappIcon size={32} round/>
        </WhatsappShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={32} round/>
        </TwitterShareButton>
      </div>
    </div>
  )
}

SocialShare.propTypes = {
  url: PropTypes.string.isRequired
}

export default SocialShare
