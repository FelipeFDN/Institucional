import express from 'express'
import Sequelize from 'sequelize'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import cors from 'cors'

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
import productClassesRoutes from './routes/public/productClassesRoutes.js'
import productClassesPrivateRoutes from './routes/private/productClassesRoutes.js'
import HighlightsRouter from './routes/public/highlightsRoutes.js'
import HighlightsPrivateRouter from './routes/private/highlightsRoutes.js'


//Models
import User from './models/User.js'
import Product from './models/Product.js'
import News from './models/News.js'
import NewsImage from './models/NewsImage.js'
import ProductClasses from './models/ProductClasses.js'
import Highlights from './models/Highlights.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:80', 'http://localhost']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: origem não permitida → ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(path.join(__dirname, '../uploads')))

//Rotas públicas
app.use('/api/auth', authRoutes)
app.use('/api/produtos', productRoutes)
app.use('/api/noticias', newsRoutes)
app.use('/api/classes', productClassesRoutes)
app.use('/api/destaques', HighlightsRouter)

//middleware
app.use(authToken)

//Rotas privadas
app.use('/api/usuarios', userPrivateRoutes)
app.use('/api/imagens', imagePrivateRoutes)
app.use('/api/produtosP', productPrivateRoutes)
app.use('/api/noticiasP', newsPrivateRoutes)
app.use('/api/classesP', productClassesPrivateRoutes)
app.use('/api/destaquesP', HighlightsPrivateRouter)

const sequelize = new Sequelize(config)
const models = { User, Product, News, NewsImage, ProductClasses, Highlights }

Object.values(models).forEach((model) => {
    model.init(sequelize)
})

Object.values(models).forEach((model) => {
    if (model.associate) model.associate(models)
})

sequelize.authenticate().then(() => {
    app.listen(3000, () => {
        console.log("App listenning.")
    })
}).catch((err) => {
    console.log(err)
})

