const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    region: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cities", citySchema);
