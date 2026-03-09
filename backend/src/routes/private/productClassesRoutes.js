import express from 'express'
import { createProductClass, updateProductClass, deleteProductClass } from '../../controllers/productClassesController.js'

const router = express.Router()

router.post('/create', createProductClass)
router.put('/product/:id', updateProductClass)
router.delete('/product/:id', deleteProductClass)

export default router