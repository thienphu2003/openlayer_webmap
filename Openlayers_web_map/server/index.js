const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // Thêm path module
const saveGeoJSONToDatabase = require("./service/GeolocationService");
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
app.get("/", async function (req, res) {
  await saveGeoJSONToDatabase();
  res.render("index");
});

app.post("/", async function (req, res) {
  const result = await save(req.body);
  res.json({ count: result.total_click, time: result.last_time_click });
});

// app.get("/:ID", async function (req, res) {
//   await getData(req.params);
// });
