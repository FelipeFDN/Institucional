import User from '../models/User.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

export const createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const result = await User.create({
            id: crypto.randomUUID(),
            email: email,
            name: name,
            password: hashPassword
        })

        const user = result
        delete user.dataValues.password
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()

        const usersToResponse = users.map((user)=>{return {id: user.id, email: user.email, name: user.name, deleted: user.deleted}})

        res.status(200).json(usersToResponse)
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {email: req.params.email}
        })

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name
        })
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
    
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.update(
            { deleted:true, deleted_by: req.user_id },
            { where: {id: req.params.id}}
        )
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente."})
    }
}