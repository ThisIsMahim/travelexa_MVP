const fs = require("fs");
const path = require("path");
const City = require("../models/cityModel");

const CITIES_FILE = path.join(__dirname, "../data/cities.json");

// List cities from Mongo
const GetAllCities = async (req, res) => {
  try {
    const cities = await City.find({ active: true }).sort({ name: 1 });
    return res.status(200).send({ status: "success", data: cities });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

// Add a city to Mongo
const AddCity = async (req, res) => {
  try {
    const { name, region, active } = req.body;
    if (!name) return res.status(400).send({ status: "fail", message: "'name' is required" });
    const created = await City.create({ name, region, active });
    return res.status(201).send({ status: "success", data: created });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

// Update a city in Mongo
const UpdateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, active } = req.body;
    const updated = await City.findByIdAndUpdate(
      id,
      { ...(name !== undefined ? { name } : {}), ...(region !== undefined ? { region } : {}), ...(active !== undefined ? { active } : {}) },
      { new: true }
    );
    if (!updated) return res.status(404).send({ status: "fail", message: "City not found" });
    return res.status(200).send({ status: "success", data: updated });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

// Delete a city in Mongo
const DeleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await City.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ status: "fail", message: "City not found" });
    return res.status(200).send({ status: "success" });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

// One-time import from JSON to Mongo
const ImportCitiesFromJson = async (req, res) => {
  try {
    const raw = fs.readFileSync(CITIES_FILE, "utf-8");
    const list = JSON.parse(raw);
    const docs = list.map((c) => ({ name: c.ville, region: c.region || "", active: true }));
    // Upsert by name
    for (const d of docs) {
      await City.updateOne({ name: d.name }, { $set: d }, { upsert: true });
    }
    const all = await City.find({}).sort({ name: 1 });
    return res.status(200).send({ status: "success", count: all.length, data: all });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

module.exports = { GetAllCities, AddCity, UpdateCity, DeleteCity, ImportCitiesFromJson };
