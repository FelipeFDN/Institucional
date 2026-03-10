import Product from '../models/Product.js'
import ProductClasses from '../models/ProductClasses.js'
import crypto from 'node:crypto'

import { deleteImageFile } from './imageController.js'

export const createProduct = async (req, res) => {
    try{
        const result = await Product.create({
            id: crypto.randomUUID(),
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.image_url,
            created_by: req.user.id
        })

        res.status(201).json(result)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.findAll({
            include: [{ model: ProductClasses, as: 'classId', attributes: ['id', 'tittle'] }]
        })

        res.status(200).json(products)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getProduct = async (req, res) => {
    try{
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: ProductClasses, as: 'classId', attributes: ['id', 'tittle'] }]
        })

        res.status(200).json(product)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const updateProduct = async (req, res) => {
    try{
        const existing = await Product.findByPk(req.params.id)
        if (!existing) return res.status(404).json({ message: "Produto não encontrado." })

        // Remove a imagem antiga quando substituída ou explicitamente removida (null)
        const imageChanged = req.body.image_url !== undefined && req.body.image_url !== existing.image_url
        if (imageChanged && existing.image_url) {
            const oldFilename = existing.image_url.replace('/uploads/', '')
            deleteImageFile(oldFilename)
        }

        await Product.update(req.body, { where: { id: req.params.id } })

        res.status(200).json({ message: "Produto atualizado com sucesso." })
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const deleteProduct = async (req, res) => {
    try{

        const image = await Product.findByPk(req.params.id)
        const filename = image.image_url.replace('/uploads/', '')
        deleteImageFile(filename)    

        const deleted = await Product.destroy({
            where: { id: req.params.id }
        })
        if (deleted) {
            res.status(200).json({ message: "Produto deletado com sucesso." })
        } else {
            res.status(404).json({ message: "Produto não encontrado." })
        }
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}