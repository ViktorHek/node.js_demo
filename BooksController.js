const { pool } = require('./config')

const BooksController = {
  getBooks(request, response, next) {
    pool.query('SELECT * FROM books', (error, results) => {
      if (error) {
        throw error
        // console.log(error)
      } else {
        response.status(200).json({ books: results.rows })
      }
    })
    // response.json({message: 'Looking Good Mate'})
  },
  addBook(request, response, next) {
    const { author, title } = request.body
    pool.query(
      'INSERT INTO books (author, title) VALUES ($1, $2)',
      [author, title],
      (error) => {
        if (error) {throw error}
        response.status(201).json({message: 'You just created a book buddy!'})
      }
    )
  }
}

module.exports = { BooksController }