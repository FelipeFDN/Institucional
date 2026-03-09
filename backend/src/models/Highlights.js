import Sequelize, { Model } from 'sequelize'

class Highlights extends Model {
    static init(sequelize){
        super.init({
            image_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            redirect_url: {
                type: Sequelize.STRING,
                allowNull: true
            }
        }, {sequelize})
    }
}

export default Highlights