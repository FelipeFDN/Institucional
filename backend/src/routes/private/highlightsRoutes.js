import express from 'express'
import { createHighlight, updateHighlight, deleteHighlight } from '../../controllers/highlightsController.js'

const router = express.Router()

router.post('/create', createHighlight)
router.put('/highlight/:id', updateHighlight)
router.delete('/highlight/:id', deleteHighlight)

export default router