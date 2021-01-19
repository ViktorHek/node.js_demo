const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getBooks = (request, response, next) => {
  pool.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error
      // console.log(error)
    } else {
      response.status(200).json({ books: results.rows })
    }
  })
  // response.json({message: 'Looking Good Mate'})
}

app.route('/books').get(getBooks)

app.listen(3001, () => {
  console.log('Server is up and running...')
})
