import express from 'express'
import Sequelize from 'sequelize'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from './config/database.js'

import authToken from './middlewares/authToken.js'

//Rotas
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import imageRoutes from './routes/imageRoutes.js'

//Models
import User from './models/User.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


app.use('/auth', authRoutes)

//middleware
app.use(authToken)

app.use('/usuarios', userRoutes)
app.use('/imagens', imageRoutes)

const sequelize = new Sequelize(config)
User.init(sequelize)

sequelize.authenticate().then(() => {
    app.listen(3000, () => {
        console.log("App listenning.")
    })
}).catch((err) => {
    console.log(err)
})

