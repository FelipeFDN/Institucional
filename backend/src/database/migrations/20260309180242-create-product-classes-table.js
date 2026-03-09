'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('product_classes', { 
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
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
    await queryInterface.dropTable('product_classes');
  }
};
