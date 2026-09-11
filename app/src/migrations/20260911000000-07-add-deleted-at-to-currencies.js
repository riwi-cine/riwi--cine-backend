'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('currencies', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('currencies', 'deleted_at');
  }
};
