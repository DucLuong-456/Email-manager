const express = require('express')
const app = express()
const singInRouter = require('./src/route/sign-in')

app.use('/api',singInRouter)

const PORT = 3000
app.listen(PORT,console.log(`App listening on PORT: ${PORT}`))
