const Sequelize = require("sequelize");
const sequelize = require("../lib/db");

const AllergenDish = sequelize.define(
  "allergenDish",
  {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    allergenId: {
      type: Sequelize.UUIDV4
    },
    dishId: {
      type: Sequelize.UUIDV4
    }
  },
  {
    tableName: "allergensDishes"
  }
);

module.exports = AllergenDish;
