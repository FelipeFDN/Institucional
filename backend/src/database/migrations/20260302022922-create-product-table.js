'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('products', { 
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
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
        class: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'product_classes',
            key: 'id'
          }
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
