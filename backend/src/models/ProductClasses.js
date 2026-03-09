import Sequelize, { Model } from 'sequelize'

class ProductClasses extends Model {
    static init(sequelize){
        super.init({
            tittle: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, {sequelize})
    }
}

export default ProductClasses