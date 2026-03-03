import express from 'express'
import { getAllProducts, getProduct } from '../../controllers/productController.js'

const router = express.Router()

router.get('/todos', getAllProducts)
router.get('/product/:id', getProduct)

export default router