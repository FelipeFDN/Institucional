import Sequelize, { Model } from 'sequelize'

class User extends Model {
    static init(sequelize){
        super.init({
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {sequelize})
    }
}

export default User