/* eslint-disable */
const CopyPlugin = require('copy-webpack-plugin')

module.exports = config => {
  const isDev = config.mode !== 'production'

  if (isDev) {
    const copy = new CopyPlugin({
      patterns: [{ from: './dev-app-update.yml', to: '.' }],
    })

    config.plugins.push(copy)
  }

  return config
}
