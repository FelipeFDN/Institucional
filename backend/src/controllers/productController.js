import Product from '../models/Product.js'
import crypto from 'node:crypto'

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
        res.status(500).json({ message: "Erro no servidor, tente novamente." + err})
    }
}

export const getAllProducts = async (req, res) => {
    try{
        res.status(200)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getProduct = async (req, res) => {
    try{
        res.status(200)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const updateProduct = async (req, res) => {
    try{
        res.status(200)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const deleteProduct = async (req, res) => {
    try{
        res.status(200)
    }catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}