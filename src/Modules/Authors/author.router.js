import * as authorService from './author.service.js'
import { Router } from 'express'

const router = Router()

router.post('/collection/authors', authorService.createAuthorImplicit)

export default router