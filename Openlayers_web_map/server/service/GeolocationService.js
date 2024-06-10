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
    // Xóa tất cả các bản ghi trong City mà không quan tâm đến paranoid
    await City.destroy({
      where: {},
      force: true, // Sử dụng force: true để bỏ qua paranoid
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

async function resetTotalClickCountToZero() {
  try {
    // Lấy tất cả các bản ghi trong City
    const cities = await City.findAll();

    // Cập nhật total_click_count của mỗi bản ghi về 0
    await Promise.all(
      cities.map((city) => city.update({ total_click_count: 0 }))
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveGeoJSONToDatabase,
  resetTotalClickCountToZero,
};
