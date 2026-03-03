import express from 'express'
import { getAllNews, getNews } from '../../controllers/newsController.js'

const router = express.Router()

router.get('/todos', getAllNews)
router.get('/news/:id', getNews)

export default router