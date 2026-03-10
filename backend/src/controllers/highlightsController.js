import Highlights from '../models/Highlights.js'
import crypto from 'node:crypto'
import { deleteImageFile } from './imageController.js'

export const createHighlight = async (req, res) => {
    try{
        const result = await Highlights.create({
            id: crypto.randomUUID(),
            tittle: req.body.tittle || null,
            description: req.body.description || null,
            image_url: req.body.image_url || null,
            redirect_url: req.body.redirect_url || null,
            order: req.body.order ?? 0,
            active: req.body.active ?? true,
        })
        res.status(201).json(result)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllHighlights = async (req, res) => {
    try{
        const highlights = await Highlights.findAll({
            where: { active: true },
            order: [['order', 'ASC']],
        })
        res.status(200).json(highlights)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllHighlightsAdmin = async (req, res) => {
    try{
        const highlights = await Highlights.findAll({
            order: [['order', 'ASC']],
        })
        res.status(200).json(highlights)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const updateHighlight = async (req, res) => {
    try{
        const existing = await Highlights.findByPk(req.params.id)
        if (!existing) return res.status(404).json({ message: "Destaque não encontrado." })

        const imageChanged = req.body.image_url !== undefined && req.body.image_url !== existing.image_url
        if (imageChanged && existing.image_url) {
            const oldFilename = existing.image_url.replace('/uploads/', '')
            deleteImageFile(oldFilename)
        }

        await Highlights.update(req.body, { where: { id: req.params.id } })
        res.status(200).json({ message: "Destaque atualizado com sucesso." })
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const deleteHighlight = async (req, res) => {
    try{
        const highlight = await Highlights.findByPk(req.params.id)
        if (!highlight) return res.status(404).json({ message: "Destaque não encontrado." })

        if (highlight.image_url) {
            const filename = highlight.image_url.replace('/uploads/', '')
            deleteImageFile(filename)
        }

        await Highlights.destroy({ where: { id: req.params.id } })
        res.status(200).json({ message: "Destaque deletado com sucesso." })
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}