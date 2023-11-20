const singInRouter = require('express').Router()
const singInController = require('../controller/sign-in')
singInRouter.get('/sign-in',singInController.getSignIn)


module.exports = singInRouter