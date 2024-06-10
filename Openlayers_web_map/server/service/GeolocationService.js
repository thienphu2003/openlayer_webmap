// saveGeoJSONToDatabase.js

const fs = require("fs");
const City = require("../model/City");
const path = require("path");
const axios = require("axios");
const { sequelize } = require("../models");

const geojsonFilePath = `${path.join(__dirname, "../data/map.geojson")}`;
const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, "utf8"));

async function saveGeoJSONToDatabase() {
  try {
    for (const feature of geojson.features) {
      const { ID, Cityname, Cityimage, description } = feature.properties;
      const coordinates = feature.geometry.coordinates;
      console.log("🚀 ~ saveGeoJSONToDatabase ~ coordinates:", coordinates);
      const t = await sequelize.transaction();
      await City.truncate({ t });

      const newRecords = await City.create(
        {
          ID,
          Cityname,
          Cityimage,
          location: { type: "Point", coordinates },
          description,
          total_click_count: 0,
        },
        { t }
      );
    }
    await t.commit();
    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
    await t.rollback();
  }
}

module.exports = saveGeoJSONToDatabase;
