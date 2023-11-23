const emailRouter = require('express').Router()
const emailController = require('../controller/email')
const auth = require('../middlerware/auth')
//route render
emailRouter.get('/sign-in',emailController.getSignIn)
emailRouter.get('/sign-up',emailController.getSignUp)
emailRouter.get('/inbox-page',auth,emailController.getInboxPage)
emailRouter.get('/outbox-page',auth,emailController.getOutboxPage)
emailRouter.get('/detail-email/:id',auth,emailController.getEmailDetail)
emailRouter.get('/create-email',emailController.getCreateEmail)
emailRouter.get('/logout',auth,emailController.Logout)

//route handler
emailRouter.post('/register',emailController.createUser)
emailRouter.post('/login',emailController.login)
emailRouter.post('/create',auth,emailController.CreateEmail)


module.exports = emailRouter