const { DataTypes } = require("sequelize");
const moment = require("moment");
const db = require("../models/index");

const City = db.sequelize.define(
  "city",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Cityname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Cityimage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSON,
    },
    last_time_click: {
      type: DataTypes.DATE,
    },
    total_click_count: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    deleted_at: { type: DataTypes.DATE },
  },
  {
    hooks: {
      beforeCreate: (city) => {},
      beforeUpdate: (city) => {},
    },
    timestamps: true,
    underscored: false,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    defaultScope: {
      //   attributes: {
      //     exclude: ["deleted_at", "createdAt", "updatedAt", "deletedAt"],
      //   },
    },
    scopes: {
      deleted: {
        where: { deleted_at: { $ne: null } },
        paranoid: false,
      },
    },
  }
);

module.exports = City;
