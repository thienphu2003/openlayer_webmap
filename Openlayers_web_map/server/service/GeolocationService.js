// saveGeoJSONToDatabase.js

const fs = require("fs");
const City = require("../model/City");
const path = require("path");
const axios = require("axios");
const { Sequelize } = require("../models");
const { Op } = require("sequelize");

async function saveGeoJSONToDatabase() {
  try {
    await Promise.all([
      City.update(
        {
          total_click_count: 0,
        },
        {
          where: {
            total_click_count: {
              [Op.gt]: 0,
            },
          },
        }
      ),
    ]);
    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
  }
}

module.exports = saveGeoJSONToDatabase;
