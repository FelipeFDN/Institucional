import Highlights from '../models/Highlights.js'
import crypto from 'node:crypto'
import { deleteImageFile } from './imageController.js'

export const createHighlight = async (req, res) => {
    try{
        const result = await Highlights.create({
            id: crypto.randomUUID(),
            image_url: req.body.image_url,
            redirect_url: req.user.redirect_url
        })

        res.status(201).json(result)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllHighlights = async (req, res) => {
    try{
        const highlights = await Highlights.findAll()

        res.status(200).json(highlights)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const updateHighlight = async (req, res) => {
    try{
        const highlight = await Highlights.update( 
            req.body,
            { where: {id: req.params.id} }
        )

        res.status(200).json({ message: "Destaque atualizado com sucesso." })
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const deleteHighlight = async (req, res) => {
    try{
        const image = await Highlights.findByPk(req.params.id)
        const filename = image.image_url.replace('/uploads/', '')
        deleteImageFile(filename)    

        const deleted = await Highlights.destroy({
            where: { id: req.params.id }
        })

        if (deleted) {
            res.status(200).json({ message: "Destaque deletado com sucesso." })
        } else {
            res.status(404).json({ message: "Notícia não encontrada." })
        }
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}