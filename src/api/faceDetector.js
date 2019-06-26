/**
 * @author Yuriy Matviyuk
 */
import * as faceapi from 'face-api.js'

/**
 * Path to models
 *
 * @type {string}
 */
const MODELS_URL = '/models'

/**
 * Load model
 *
 * @returns {Promise<void>}
 */
const loadModel = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL)
}

/**
 * Detect face
 *
 * @param input
 *
 * @returns {Promise<FaceDetection>}
 */
const detectFace = async (input) => {
  await loadModel()
  await faceapi.detectSingleFace(input, new faceapi.TinyFaceDetectorOptions()).run()
}

export default detectFace
