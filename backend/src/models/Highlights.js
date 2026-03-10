import Sequelize, { Model } from 'sequelize'

class Highlights extends Model {
    static init(sequelize){
        super.init({
            tittle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            redirect_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {sequelize})
    }
}

export default Highlights