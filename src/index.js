/**
 * @author Yuriy Matviyuk
 */
import './styles/index.css'
import * as serviceWorker from './serviceWorker'
import App from './components/App'
import i18n from './api/i18n'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { subscribeUser } from './subscription'

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
setTimeout(subscribeUser, 2000)
