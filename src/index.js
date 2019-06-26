/**
 * @author Yuriy Matviyuk
 */
import './styles/index.css'
import * as serviceWorker from './serviceWorker'
import App from './components/App'
import i18n from './api/i18n'
import { I18nextProvider } from 'react-i18next'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

ReactDOM.hydrate((
  <BrowserRouter>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App/>
      </I18nextProvider>
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))
serviceWorker.register()
