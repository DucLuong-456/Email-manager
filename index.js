const express = require('express')
const app = express()
const emailRouter = require('./src/route/email')
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use('/api',emailRouter)

const PORT = 3000
app.listen(PORT,console.log(`App listening on PORT: ${PORT}`))