import express from 'express'
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js'

const router = express.Router()

router.post('/create', createProduct)
router.get('/todos', getAllProducts)
router.get('/product/:id', getProduct)
router.put('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

export default router