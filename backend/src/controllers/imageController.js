import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, '../../../uploads')

export const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhuma imagem enviada.' })
        }

        res.status(201).json({
            message: 'Imagem enviada com sucesso.',
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        })
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}

export const getAllImages = (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir)

        const images = files.map(file => ({
            filename: file,
            url: `/uploads/${file}`
        }))

        res.status(200).json(images)
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}

export const deleteImageFile = (filename) => {
    const filePath = path.join(uploadsDir, filename)
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}

export const deleteImage = (req, res) => {
    try {
        const { filename } = req.params
        const filePath = path.join(uploadsDir, filename)

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Imagem não encontrada.' })
        }

        fs.unlinkSync(filePath)
        res.status(200).json({ message: 'Imagem deletada com sucesso.' })
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}
