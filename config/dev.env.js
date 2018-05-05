'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: 8000,
  API_ROOT_PATH: '"http://api.siluyunyu.com/siyu/api"'
})
