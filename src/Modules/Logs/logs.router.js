import * as logsService from './logs.service.js'
import { Router } from 'express'

const router = Router()

router.post('/collection/logs/capped', logsService.createCappedCollection)
router.post('/logs', logsService.insertLog)

export default router