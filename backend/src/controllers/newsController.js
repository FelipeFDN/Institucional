import News from '../models/News.js'
import NewsImage from '../models/NewsImage.js'
import crypto from 'node:crypto'
import { deleteImageFile } from './imageController.js'

export const createNews = async (req, res) => {
    try{
        const result = await News.create({
            id: crypto.randomUUID(),
            tittle: req.body.tittle,
            description: req.body.description,
            body: req.body.body,
            image_url: req.body.image_url,
            created_by: req.user.id
        })

        res.status(201).json(result)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllNews = async (req, res) => {
    try{
        const news = await News.findAll()

        res.status(200).json(news)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getNews = async (req, res) => {
    try{
        const news = await News.findByPk(req.params.id, {
            include: [{ model: NewsImage, as: 'images' }]
        })

        if (!news) return res.status(404).json({ message: "Notícia não encontrada." })

        res.status(200).json(news)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const updateNews = async (req, res) => {
    try{
        const existing = await News.findByPk(req.params.id)
        if (!existing) return res.status(404).json({ message: "Notícia não encontrada." })

        const imageChanged = req.body.image_url !== undefined && req.body.image_url !== existing.image_url
        if (imageChanged && existing.image_url) {
            const oldFilename = existing.image_url.replace('/uploads/', '')
            deleteImageFile(oldFilename)
        }

        await News.update(req.body, { where: { id: req.params.id } })

        res.status(200).json({ message: "Notícia atualizada com sucesso." })
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const deleteNews = async (req, res) => {
    try{
        const images = await NewsImage.findAll({
            where: { news_id: req.params.id }
        })

        images.forEach(image => {
            const filename = image.image_url.replace('/uploads/', '')
            deleteImageFile(filename)
        })

        await NewsImage.destroy({ where: { news_id: req.params.id } })

        const image = await News.findByPk(req.params.id)
        const filename = image.image_url.replace('/uploads/', '')
        deleteImageFile(filename)    

        const deleted = await News.destroy({
            where: { id: req.params.id }
        })

        if (deleted) {
            res.status(200).json({ message: "Notícia deletada com sucesso." })
        } else {
            res.status(404).json({ message: "Notícia não encontrada." })
        }
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const addImages = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id)

        if (!news) {
            return res.status(404).json({ message: "Notícia não encontrada." })
        }

        const images = req.files.map(file => ({
            id: crypto.randomUUID(),
            news_id: news.id,
            image_url: `/uploads/${file.filename}`
        }))

        await NewsImage.bulkCreate(images)

        res.status(201).json({ message: "Imagens adicionadas com sucesso.", images })
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const deleteNewsImage = async (req, res) => {
    try {
        const image = await NewsImage.findOne({
            where: { id: req.params.imageId, news_id: req.params.id }
        })

        if (!image) return res.status(404).json({ message: "Imagem não encontrada." })

        const filename = image.image_url.replace('/uploads/', '')
        deleteImageFile(filename)

        await image.destroy()

        res.status(200).json({ message: "Imagem deletada com sucesso." })
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}