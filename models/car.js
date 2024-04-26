"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  car.init(
    {
      model: DataTypes.STRING,
      type: DataTypes.STRING,
      capacity: DataTypes.STRING,
      price: DataTypes.FLOAT,
      imageUrl: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      deletedBy: DataTypes.STRING,
      lastUpdateBy: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "car",
      paranoid: true,
      deletedAt: "deletedAt",
    }
  );
  return car;
};
