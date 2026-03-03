import express from 'express'
import Sequelize from 'sequelize'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from './config/database.js'

import authToken from './middlewares/authToken.js'

//Rotas
import userPrivateRoutes from './routes/private/userRoutes.js'
import authRoutes from './routes/public/authRoutes.js'
import imagePrivateRoutes from './routes/private/imageRoutes.js'
import productPrivateRoutes from './routes/private/productRoutes.js'
import newsPrivateRoutes from './routes/private/newsRoutes.js'
import newsRoutes from './routes/public/newsRoutes.js'
import productRoutes from './routes/public/productRoutes.js'

//Models
import User from './models/User.js'
import Product from './models/Product.js'
import News from './models/News.js'
import NewsImage from './models/NewsImage.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

//Rotas públicas
app.use('/auth', authRoutes)
app.use('/produtos', productRoutes)
app.use('/noticias', newsRoutes)

//middleware
app.use(authToken)

//Rotas privadas
app.use('/usuarios', userPrivateRoutes)
app.use('/imagens', imagePrivateRoutes)
app.use('/produtos', productPrivateRoutes)
app.use('/noticias', newsPrivateRoutes)

const sequelize = new Sequelize(config)
User.init(sequelize)
Product.init(sequelize)
News.init(sequelize)
NewsImage.init(sequelize)

sequelize.authenticate().then(() => {
    app.listen(3000, () => {
        console.log("App listenning.")
    })
}).catch((err) => {
    console.log(err)
})

