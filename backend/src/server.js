import express from 'express'
import Sequelize from 'sequelize'

import config from './config/database.js'

import authToken from './middlewares/authToken.js'


//Rotas
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'

//Models
import User from './models/User.js'

const app = express()
app.use(express.json())


app.use('/auth', authRoutes)

//middleware
app.use(authToken)

app.use('/usuarios', userRoutes)

const sequelize = new Sequelize(config)
User.init(sequelize)

sequelize.authenticate().then(() => {
    app.listen(3000, () => {
        console.log("App listenning.")
    })
}).catch((err) => {
    console.log(err)
})

