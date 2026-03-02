import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await await User.findOne({
            where: {email: email}
        })

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Senha inválida.' })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ name: user.name, token: token })
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}
