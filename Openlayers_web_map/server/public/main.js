window.onload = init;

const totalCountClick = 0;

const SERVER_HOST = "http://ec2-3-233-122-181.compute-1.amazonaws.com";

const IMAGE_PRODUCTION_URL =
  "https://kietphuhuybucket.s3.amazonaws.com/City_images/";

function init() {
  const vietnamCenterCoordinate = [107.8167, 16.4764];
  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat(vietnamCenterCoordinate),
      zoom: 3,
      extent: ol.proj.transformExtent(
        [99, 8, 115, 28],
        "EPSG:4326",
        "EPSG:3857"
      ),
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "openlayers-map",
  });

  // // Australian Cities GeoJSON
  const vietnamCitiesStyle = function (feature) {
    let cityID = feature.get("ID");
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [77, 219, 105, 0.6],
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2,
          }),
          radius: 12,
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [232, 26, 26, 1],
          }),
          stroke: new ol.style.Stroke({
            color: [232, 26, 26, 1],
            width: 0.3,
          }),
        }),
      }),
    ];
    return styles;
  };

  const styleForSelect = function (feature) {
    let cityID = feature.get("ID");
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [247, 26, 10, 0.5],
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2,
          }),
          radius: 12,
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [87, 9, 9, 1],
          }),
          stroke: new ol.style.Stroke({
            color: [87, 9, 9, 1],
            width: 0.5,
          }),
        }),
      }),
    ];
    return styles;
  };

  const vietnamCitiesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: "/map.geojson",
    }),
    style: vietnamCitiesStyle,
  });
  map.addLayer(vietnamCitiesLayer);

  // // Map Features Click Logic
  const navElements = document.querySelector(".column-navigation");
  const cityNameElement = document.getElementById("cityname");
  const cityImageElement = document.getElementById("cityimage");
  const cityDescription = document.getElementById("placedescription");
  const totalClickCount = document.getElementById("total_click_count");
  const placeCoordinate = document.getElementById("place_coordinates");
  const mapView = map.getView();

  map.on("singleclick", function (evt) {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      let featureName = feature.get("Cityname");
      let navElement = navElements.children.namedItem(featureName);
      mainLogic(feature, navElement);
    });
  });

  async function mainLogic(feature, clickedAnchorElement) {
    // Re-assign active class to the clicked element
    let currentActiveStyledElement = document.querySelector(".active");
    currentActiveStyledElement.className =
      currentActiveStyledElement.className.replace("active", "");
    clickedAnchorElement.className = "active";

    // Default style for all features
    let vietnamCitiesFeatures = vietnamCitiesLayer.getSource().getFeatures();
    vietnamCitiesFeatures.forEach(function (feature) {
      feature.setStyle(vietnamCitiesStyle);
    });

    // Home Element : Change content in the menu to HOME
    if (clickedAnchorElement.id === "Home") {
      mapView.animate({ center: vietnamCenterCoordinate }, { zoom: 4 });
      cityNameElement.innerHTML = "Welcome to VietNam Tourist Attractions";
      cityImageElement.setAttribute(
        "src",
        IMAGE_PRODUCTION_URL + "Vietnam-travel-24_1653706931.jpg"
      );
      cityDescription.innerHTML = "";
      totalClickCount.innerHTML = "";
    }
    // Change view, and content in the menu based on the feature
    else {
      feature.setStyle(styleForSelect);
      let featureCoordinates = feature.get("geometry").getCoordinates();
      placeCoordinate.innerHTML =
        "Longitude: " +
        featureCoordinates[0] +
        ", " +
        "Latitude: " +
        featureCoordinates[1];
      mapView.animate({ center: featureCoordinates }, { zoom: 5 });
      let featureName = feature.get("Cityname");
      let featureImage = feature.get("Cityimage");
      let featureDescription = feature.get("description");
      cityNameElement.innerHTML = "Name of the place: " + featureName;
      cityImageElement.setAttribute("src", IMAGE_PRODUCTION_URL + featureImage);
      cityDescription.innerHTML = featureDescription;
      totalClickCount.innerHTML = totalCountClick;
      const data = {
        ID: feature.get("ID"),
      };
      console.log(data);
      const response = await fetch(SERVER_HOST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const date = new Date(result.time);
      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      });
      const formattedDate = formatter.format(date);
      console.log(formattedDate);

      totalClickCount.innerHTML =
        "Total Click Count " +
        result?.count +
        " and last time click  " +
        formattedDate;
    }
  }

  // Navigation Button Logic
  const anchorNavElements = document.querySelectorAll(".column-navigation > a");
  for (let anchorNavElement of anchorNavElements) {
    anchorNavElement.addEventListener("click", function (e) {
      let clickedAnchorElement = e.currentTarget;
      let clickedAnchorElementID = clickedAnchorElement.id;
      let vietnamCitiesFeatures = vietnamCitiesLayer.getSource().getFeatures();
      vietnamCitiesFeatures.forEach(function (feature) {
        let featureCityName = feature.get("Cityname");
        if (clickedAnchorElementID === featureCityName) {
          mainLogic(feature, clickedAnchorElement);
        }
      });

      // Home Navigation Case
      if (clickedAnchorElementID === "Home") {
        mainLogic(undefined, clickedAnchorElement);
      }
    });
  }

  // Features Hover Logic
  const popoverTextElement = document.getElementById("popover-text");
  const popoverTextLayer = new ol.Overlay({
    element: popoverTextElement,
    positioning: "bottom-center",
    stopEvent: false,
  });
  map.addOverlay(popoverTextLayer);

  map.on("pointermove", function (evt) {
    let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
    if (isFeatureAtPixel) {
      let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
      let featureName = featureAtPixel[0].get("Cityname");
      popoverTextLayer.setPosition(evt.coordinate);
      popoverTextElement.innerHTML = featureName;
      map.getViewport().style.cursor = "pointer";
    } else {
      popoverTextLayer.setPosition(undefined);
      map.getViewport().style.cursor = "";
    }
  });
}
