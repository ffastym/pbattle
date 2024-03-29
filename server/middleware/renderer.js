import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from '../../src/components/App'
import Head from '../../src/components/global/Head'
import { StaticRouter } from 'react-router-dom'
import path from 'path'
import fs from 'fs'
import store from '../../src/store'
import { Provider } from 'react-redux'

export default (req, res) => {
  // point to the html file created by CRA's build tool
  const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html')

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('err', err)
      return res.status(404).end()
    }

    htmlData = htmlData.replace(
      `</head>`,
      `${ReactDOMServer.renderToString(<Head/>)}</head>`)

    const context = {}
    // render the app as a string
    const html = ReactDOMServer.renderToString(
      <StaticRouter context={context}>
        <Provider store={store}>
          <App/>
        </Provider>
      </StaticRouter>
    )

    // inject the rendered app into our html and send it
    return res.send(
      htmlData.replace(
        `<div id="root"></div>`,
        `<div id="root">${html}</div>`
      )
    )
  })
}
