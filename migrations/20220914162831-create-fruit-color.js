'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FruitColors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fruitId: {
        type: Sequelize.INTEGER,
        references: { model: 'Fruits', key: 'id' }
      },
      color: {
        type: 'fruit_color_enum'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.sequelize.query(
      'CREATE UNIQUE INDEX ON "FruitColors" ("fruitId", "color")'
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FruitColors');
  }
};