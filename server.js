const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {BooksController} = require('./BooksController')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app
  .route('/books')
  .get(BooksController.getBooks)
  .post(BooksController.addBook)

app.listen(3001, () => {
  console.log('Server is up and running...')
})
