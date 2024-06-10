const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // Thêm path module
const {
  saveGeoJSONToDatabase,
  resetTotalClickCountToZero,
} = require("./service/GeolocationService");
const { save, getData } = require("./service/CityService");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
// app.use(express.static(__dirname, "../libs/v9.1.0-package/ol.css"));
app.set("port", 3002);
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "../libs/v9.1.0-package")));
app.use(express.static(path.join(__dirname, "./data")));
app.use(express.static(path.join(__dirname, "./data/City_images")));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.listen(app.get("port"), function (err) {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log("Server is running on port", app.get("port"));
  }
});

(async () => {
  try {
    await saveGeoJSONToDatabase();
    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
  }
})();

app.get("/", async function (req, res) {
  try {
    // Đảm bảo rằng total_click_count trong cơ sở dữ liệu được cập nhật về 0
    await resetTotalClickCountToZero();

    // Render trang index
    res.render("index");
  } catch (error) {
    console.error("Error resetting total_click_count:", error);
    // Trả về một trang lỗi nếu có lỗi xảy ra
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async function (req, res) {
  const result = await save(req.body);
  res.json({ count: result.total_click, time: result.last_time_click });
});
