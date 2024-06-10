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
    // Xóa tất cả các bản ghi trong City trước khi thêm dữ liệu mới
    await City.destroy({
      where: {},
      truncate: true,
    });

    for (const feature of geojson.features) {
      const { ID, Cityname, Cityimage, description } = feature.properties;
      const coordinates = feature.geometry.coordinates;
      console.log("🚀 ~ saveGeoJSONToDatabase ~ coordinates:", coordinates);

      // Thêm mới một bản ghi trong City với các thuộc tính từ GeoJSON
      await City.create({
        ID,
        Cityname,
        Cityimage,
        location: { type: "Point", coordinates },
        description,
        total_click_count: 0,
      });
    }

    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
  }
}

module.exports = saveGeoJSONToDatabase;
