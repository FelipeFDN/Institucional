import express from 'express'
import Sequelize from 'sequelize'

import config from './config/database.js'

import userRoutes from './routes/userRoutes.js'
import User from './models/User.js'

const app = express()
app.use(express.json())

const sequelize = new Sequelize(config)
User.init(sequelize)

app.use('/usuarios', userRoutes)

sequelize.authenticate().then(() => {
    app.listen(3000, () => {
        console.log("App listenning.")
    })
}).catch((err) => {
    console.log(err)
})

