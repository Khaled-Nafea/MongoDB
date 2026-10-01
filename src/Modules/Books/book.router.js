import * as bookService from './book.service.js'
import { Router } from 'express'

const router = Router()

router.post('/collection/books', bookService.createBooksCollection)
router.post('/collection/books/index', bookService.createBookIndex)
router.post('/books', bookService.addBook)
router.post('/books/batch', bookService.addBooks)
router.patch('/books/:title', bookService.updateBookTitle)
router.get('/books', bookService.getBooks)
router.get('/books/title', bookService.getBookByTitle)
router.get('/books/year', bookService.getBooksByYearRange)
router.get('/books/genre', bookService.getBooksByGenre)
router.get('/books/skip-limit', bookService.getBooksSkipLimit)
router.get('/books/year-integer', bookService.getBooksByIntegerYear)
router.get('/books/exclude-genres', bookService.getBooksExcludeGenres)
router.delete('/books/before-year', bookService.deleteBooksBeforeYear)
router.get('/books/aggregate1', bookService.getBooksAggregate1)
router.get('/books/aggregate2', bookService.getBooksAggregate2)
router.get('/books/aggregate3', bookService.getBooksAggregate3)
router.get('/books/aggregate4', bookService.getBooksAggregate4)

export default router