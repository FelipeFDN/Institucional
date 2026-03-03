import express from 'express'
import { createUser,  getAllUsers, getUser, deleteUser} from '../../controllers/userController.js'

const router = express.Router()

router.post('/cadastro', createUser)
router.get('/todos', getAllUsers)
router.get('/user/:email', getUser)
router.delete('/deletar/:id', deleteUser)

export default router