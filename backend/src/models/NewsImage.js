import Sequelize, { Model } from 'sequelize'

class NewsImage extends Model {
    static init(sequelize){
        super.init({
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false
            },
            news_id: {
                type: Sequelize.UUID,
                allowNull: true
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: true
            }
        }, {sequelize})
    }
    static associate(models) {
        this.belongsTo(models.News, { foreignKey: 'news_id', as: 'news' })
    }
}

export default NewsImage