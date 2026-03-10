'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('highlights', 'tittle', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('highlights', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('highlights', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('highlights', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('highlights', 'tittle');
    await queryInterface.removeColumn('highlights', 'description');
    await queryInterface.removeColumn('highlights', 'order');
    await queryInterface.removeColumn('highlights', 'active');
  },
};
