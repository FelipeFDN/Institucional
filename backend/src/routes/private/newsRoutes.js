import express from 'express'
import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createNews, updateNews, deleteNews, addImages, deleteNewsImage } from '../../controllers/newsController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Tipo não permitido.'))
    }
})

const router = express.Router()

router.post('/create', createNews)
router.put('/news/:id', updateNews)
router.post('/news/:id/images', upload.array('images', 10), addImages)
router.delete('/news/:id/images/:imageId', deleteNewsImage)
router.delete('/news/:id', deleteNews)

export default router