const { pool } = require('./config')
const {wsServer, WebSocket} = require('./wsConfig')

const booksController = {
  async index(request, response, next) {
    try {
      const { rows } = await pool.query('SELECT * FROM books')
      response.status(200).json({ books: rows })
    } catch (error) {
      console.log(error)
    }
  },

  async create(request, response, next) {
    try {
      const { author, title } = request.body
      await pool.query(
        'INSERT INTO books (author, title) VALUES ($1, $2)', 
        [author, title])
        wsServer.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                book: {
                  title: title,
                  author: author
                }
              })
            )
          }
        })
      response
        .status(201)
        .json({ message: 'You just created a book buddy!' })
    } catch (error) {
      console.log(error)
    }
  },

  async show(request, response, next) {
    try {
      const { id } = request.params
      const {
        rows,
      } = await pool.query('SELECT * FROM books WHERE id = $1 LIMIT 1', [id])
      response.status(200).json({ book: rows[0] })
    } catch (error) {
      console.log(error)
    }
  },

  async delete(request, response, next) {
    try {
      const { id } = request.params
      await pool.query('DELETE FROM books WHERE id = $1', [id])
      response.status(202).json({ message: 'your book has been deleted' })
    } catch (error) {
      console.log(error)
    }
  },

  async update(request, response, next) {
    try {
      const { author, title } = request.body
      const { id } = request.params
      const { rows } = await pool.query(
        `UPDATE books 
        SET author = $1, title = $2 
        WHERE id = $3
        RETURNING *
        `,
        [author, title, id]
      )
      response
        .status(201)
        .json({ message: 'your book was updated', book: rows[0] })
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = { booksController }

// index
// pool.query('SELECT * FROM books', (error, results) => {
//   if (error) {
//     throw error
//     // console.log(error)
//   } else {
//     response.status(200).json({ books: results.rows })
//   }
// })
// // response.json({message: 'Looking Good Mate'})

// create
// const { author, title } = request.body
// pool.query(
//   'INSERT INTO books (author, title) VALUES ($1, $2)',
//   [author, title],
//   (error) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).json({ message: 'You just created a book buddy!' })
//   }
// )
