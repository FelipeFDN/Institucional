import Sequelize, { Model } from 'sequelize'

class Product extends Model {
    static init(sequelize){
        super.init({
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_by: {
                type: Sequelize.UUID,
                allowNull: true
            }
        }, {sequelize})
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' })
    }
}

export default Product