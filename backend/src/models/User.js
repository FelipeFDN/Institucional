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
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            deleted_by: {
                type: Sequelize.UUID,
                allowNull: true
            }
        }, {sequelize})
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'deleted_by', as: 'deleted' })
    }
}

export default User