import express from 'express'
import { getAllHighlights } from '../../controllers/highlightsController.js'

const router = express.Router()

router.get('/todos', getAllHighlights)

export default router