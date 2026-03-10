import ProductClasses from '../models/ProductClasses.js'
import crypto from 'node:crypto'

import { deleteImageFile } from './imageController.js'

export const createProductClass = async (req, res) => {
    try{
        const result = await ProductClasses.create({
            id: crypto.randomUUID(),
            tittle: req.body.name,
            image_url: req.body.image_url
        })

        res.status(201).json(result)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllProductClasses = async (req, res) => {
    try{
        const classes = await ProductClasses.findAll({
            where: { deleted: false }
        })

        res.status(200).json(classes)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getProductClass = async (req, res) => {
    try{
        const class_ = await ProductClasses.findByPk(req.params.id)

        res.status(200).json(class_)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const updateProductClass = async (req, res) => {
    try{
        const existing = await ProductClasses.findByPk(req.params.id)
        if (!existing) return res.status(404).json({ message: "Classe não encontrada." })

        // Remove a imagem antiga quando substituída ou explicitamente removida (null)
        const imageChanged = req.body.image_url !== undefined && req.body.image_url !== existing.image_url
        if (imageChanged && existing.image_url) {
            const oldFilename = existing.image_url.replace('/uploads/', '')
            deleteImageFile(oldFilename)
        }

        await ProductClasses.update(req.body, { where: { id: req.params.id } })

        res.status(200).json({ message: "Produto atualizado com sucesso." })
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const deleteProductClass = async (req, res) => {
    try{

        const image = await ProductClasses.findByPk(req.params.id)
        const filename = image.image_url.replace('/uploads/', '')
        deleteImageFile(filename)    

        const deleted = await ProductClasses.update(
            { deleted:true},
            { where: {id: req.params.id}}
        )
        if (deleted) {
            res.status(200).json({ message: "Produto deletado com sucesso." })
        } else {
            res.status(404).json({ message: "Produto não encontrado." })
        }
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}