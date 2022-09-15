'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "CREATE TYPE fruit_color_enum AS enum('red', 'white', 'purple', 'orange', 'blue', 'green', 'yellow')"
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      drop type fruit_color_enum;
    `);
  }
};
