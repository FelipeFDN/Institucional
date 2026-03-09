import express from 'express'
import { getAllProductClasses, getProductClass } from '../../controllers/productClassesController.js'

const router = express.Router()

router.get('/todos', getAllProductClasses)
router.get('/class/:id', getProductClass)

export default router