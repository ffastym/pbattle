import request from 'superagent'

/**
 * @author Yuriy Matviyuk
 *
 */
const cloudName = 'ddo4y69ih'
const uploadUrl = 'https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload'
const uploadPreset = 'unsigned'
const cloudinary = {
  cloudName,
  uploadPreset,
  uploadUrl,

  /**
   * Upload file to cloud
   *
   * @param file
   * @returns {Request}
   */
  upload: (file) => {
    return request.post(uploadUrl)
      .field('upload_preset', uploadPreset)
      .field('tags', 'battle')
      .field('folder', 'battle')
      .field('file', file)
  }
}

export default cloudinary
