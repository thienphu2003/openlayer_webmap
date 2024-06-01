// saveGeoJSONToDatabase.js

const fs = require("fs");
const City = require("../model/City");
const path = require("path");
const axios = require("axios");
const { Sequelize } = require("../models");
const { Op } = require("sequelize");

// const geojsonFilePath = `${path.join(__dirname, "../data/map.geojson")}`;
// const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, "utf8"));

async function saveGeoJSONToDatabase() {
  try {
    await City.update(
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
    );

    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
  }
}

module.exports = saveGeoJSONToDatabase;
