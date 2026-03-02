import express from 'express'
import { createNews, getAllNews, getNews, updateNews, deleteNews, addImages } from '../controllers/newsController.js'

const router = express.Router()

router.post('/create', createNews)
router.get('/todos', getAllNews)
router.get('/news/:id', getNews)
router.put('/news/:id', updateNews)
router.post('/news/:id', addImages)
router.delete('/news/:id', deleteNews)

export default router