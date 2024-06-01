// saveGeoJSONToDatabase.js

const fs = require("fs");
const City = require("../model/City");
const path = require("path");
const axios = require("axios");
const { Sequelize } = require("../models");

const geojsonFilePath = `${path.join(__dirname, "../data/map.geojson")}`;
const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, "utf8"));

async function saveGeoJSONToDatabase() {
  try {
    const tasks = geojson.features.map(async (feature) => {
      const { ID } = feature.properties;
      // const coordinates = feature.geometry.coordinates;
      // console.log("🚀 ~ saveGeoJSONToDatabase ~ coordinates:", coordinates);

      const exist = await City.findOne({
        where: {
          ID,
        },
      });
      if (exist) {
        await exist.update({ total_click_count: 0 });
      }
    });

    await Promise.all(tasks);

    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
  }
}

module.exports = saveGeoJSONToDatabase;
