const emailRouter = require('express').Router()
const emailController = require('../controller/email')
const auth = require('../middlerware/auth')
const multer  = require('multer');
//nơi upload file tại local: folder upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/img');
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname);
    }
  })
  const upload = multer({ storage: storage })

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
emailRouter.post('/create',auth,upload.single('tenfile'),emailController.CreateEmail)
emailRouter.get('/delete-email/:id',auth,emailController.deleteEmail)
emailRouter.get('/panigation-email',auth,emailController.panigationEmail)



module.exports = emailRouter