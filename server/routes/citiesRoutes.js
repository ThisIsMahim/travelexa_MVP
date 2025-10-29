const express = require("express");
const router = express();

const { GetAllCities, AddCity, UpdateCity, DeleteCity, ImportCitiesFromJson } = require("../Controllers/citiesController");

router.get("/", GetAllCities);
router.post("/", AddCity);
router.put("/:id", UpdateCity);
router.delete("/:id", DeleteCity);
router.post("/import-json", ImportCitiesFromJson);

module.exports = router;
