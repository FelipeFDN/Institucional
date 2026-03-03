import express from 'express'
import { createProduct, updateProduct, deleteProduct } from '../../controllers/productController.js'

const router = express.Router()

router.post('/create', createProduct)
router.put('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

export default router