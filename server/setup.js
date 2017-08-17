const express = require('express')
const path = require('path')
const compression = require('compression')

const setupDev = (app, config) => {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(config)
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    silent: true,
    stats: 'errors-only',
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))

  app.get('*', (req, res) => {
    middleware.fileSystem.readFile(
      path.join(compiler.outputPath, 'index.html'),
      (err, file) => {
        if (err) res.sendStatus(404)
        else res.send(file.toString())
      }
    )
  })
}

const setupProd = app => {
  const publicPath = '/'
  const outputPath = path.resolve(process.cwd(), 'build')

  app.use(compression)
  app.use(publicPath, express.static(outputPath))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(outputPath, 'index.html'))
  )
}

module.exports = app => {
  const prod = process.env.NODE_ENV === 'production'
  if (prod) setupProd(app)
  else {
    const webpackConfig = require('./config/webpack.dev.babel')
    setupDev(app, webpackConfig)
  }
  return app
}
