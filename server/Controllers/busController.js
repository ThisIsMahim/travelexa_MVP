const Bus = require("../models/busModel");

// Add a new bus
const AddBus = async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ boatNumber: req.body.boatNumber });
    existingBus
      ? res.send({ message: "Boat already exists", success: false, data: null })
      : await new Bus(req.body).save();

    res.status(200).send({
      message: "Boat created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get all buses and if the journeyDate is passed 1 hour ago , make the status of the bus to "Completed"
// Only returns boats going to Sundarbans (fixed routes)
const GetAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    buses.forEach(async (bus) => {
      const journey = new Date(bus.journeyDate);

      const departure = new Date(
        `${journey.getFullYear()}-${
          journey.getMonth() + 1
        }-${journey.getDate()} ${bus.departureTime}`
      );

      if (new Date().getTime() - departure.getTime() > 3600000) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
      }
      // console.log("departure time is : ", departure);
    });

    const orderedBuses = buses.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") {
        return 1;
      } else if (a.status !== "Completed" && b.status === "Completed") {
        return -1;
      } else {
        return new Date(a.journeyDate) - new Date(b.journeyDate);
      }
    });

    res.status(200).send({
      message: "Boats fetched successfully",
      success: true,
      data: orderedBuses,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Boats Found",
      success: false,
      data: error,
    });
  }
};

// get all buses by from and to (dynamic routes)
const GetBusesByFromAndTo = async (req, res) => {
  try {
    const { from, to, journeyDate } = req.query;

    const findQuery = {};
    if (from) findQuery.from = from;
    if (to) findQuery.to = to;
    if (journeyDate) findQuery.journeyDate = journeyDate;

    const buses = await Bus.find(findQuery);

    buses.forEach(async (bus) => {
      const journey = new Date(bus.journeyDate);
      const departure = new Date(
        `${journey.getFullYear()}-${
          journey.getMonth() + 1
        }-${journey.getDate()} ${bus.departureTime}`
      );

      if (new Date().getTime() - departure.getTime() > 3600000) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
      }
    });

    const filteredBuses = buses.filter(
      (bus) => bus.status !== "Completed"
    );
    
    res.status(200).send({
      message: "Boats fetched successfully",
      success: true,
      data: filteredBuses,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Boats Found",
      success: false,
      data: error,
    });
  }
};

// update a bus
const UpdateBus = async (req, res) => {
  // if the bus is completed and actually finished, you can't update it
  const bus = await Bus.findById(req.params.id);
  try {
    const journey = new Date(bus.journeyDate);
    const departure = new Date(
      `${journey.getFullYear()}-${journey.getMonth() + 1}-${journey.getDate()} ${bus.departureTime}`
    );
    const tripFinished = new Date().getTime() - departure.getTime() > 3600000;

    if (bus.status === "Completed" && tripFinished) {
      return res.status(400).send({
        message: "You can't update a completed bus",
        success: false,
      });
    }

    await Bus.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send({
      message: "Boat updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Bus not found",
      success: false,
      data: error,
    });
  }
};

// delete a bus
const DeleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Bus deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get bus by id
const GetBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    res.status(200).send({
      message: "Bus fetched successfully",
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddBus,
  GetAllBuses,
  UpdateBus,
  DeleteBus,
  GetBusById,
  GetBusesByFromAndTo,
};
