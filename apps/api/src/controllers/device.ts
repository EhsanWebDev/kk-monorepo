import { NextFunction, Request, Response } from "express";
import {
  applyQueryOptions,
  Device,
  DeviceQueryOptions,
} from "../models/Device.js";
import { typedController } from "../middlewares/typedController.js";
import { AppError } from "../errorHandler/genericErrors.js";

export const getAllDevices = typedController(async (req, res) => {
  const {
    sort,
    sortBy,
    manufacturer,
    type,
    condition,
    status,
    page,
    limit,
    all,
  } = req.query as DeviceQueryOptions;

  const query = Device.find();
  const devices = await applyQueryOptions(query, {
    sort,
    sortBy,
    manufacturer,
    type,
    condition,
    status,
    page,
    limit,
    all,
  });

  res.status(200).json({ devices });
});
export const getDeviceById = typedController(async (req, res) => {
  const { id } = req.params;

  const device = await Device.findById(id);
  if (!device) {
    throw new AppError("Device not found", 404);
  }
  res.status(200).json({ device });
});
export const addDevice = typedController(async (req, res) => {
  const device = new Device(req.body);
  await device.save();
  res.status(201).json({ message: "Device added successfully", device });
});
export const updateDevice = typedController(async (req, res) => {
  const { id } = req.params;
  const device = await Device.findByIdAndUpdate(id, req.body, { new: true });
  if (!device) {
    throw new AppError("Device not found", 404);
  }
  res.status(200).json({ message: "Device updated successfully", device });
});
export const deleteDevice = typedController(async (req, res) => {
  const { id } = req.params;
  const device = await Device.findByIdAndDelete(id);
  if (!device) {
    throw new AppError("Device not found", 404);
  }
  res.status(200).json({ message: "Device deleted successfully", device });
});
export const deleteAllDevices = typedController(async (req, res) => {
  const devices = await Device.deleteMany({});
  res
    .status(200)
    .json({ message: "All devices deleted successfully", devices });
});

// TEMP
const tempUpdate = typedController(async (req, res) => {
  // const device = await Device.updateMany({}, {
  //   $rename: {
  //   sellingPrice:"sold_at_price"
  // }});
  const device = await Device.updateMany(
    {},
    {
      $unset: {
        selling_price: "",
      },
    },
  );

  res.status(200).json({ device });
});

export default {
  getAllDevices,
  addDevice,
  getDeviceById,
  tempUpdate,
  updateDevice,
  deleteDevice,
  deleteAllDevices,
};
