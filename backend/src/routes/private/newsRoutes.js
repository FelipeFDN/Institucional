import express from 'express'
import { createNews, updateNews, deleteNews, addImages } from '../../controllers/newsController.js'

const router = express.Router()

router.post('/create', createNews)
router.put('/news/:id', updateNews)
router.post('/news/:id', addImages)
router.delete('/news/:id', deleteNews)

export default router