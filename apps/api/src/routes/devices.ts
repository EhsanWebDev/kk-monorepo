import { Router } from "express";
import deviceController from "../controllers/device.js";
import { handleBodyValidation } from "../middlewares/validations.js";
import { deviceSchema, deviceUpdateSchema } from "@repo/types";

const router: Router = Router();

router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDeviceById);
router.post(
  "/",
  handleBodyValidation(deviceSchema),
  deviceController.addDevice,
);
router.put(
  "/:id",
  handleBodyValidation(deviceUpdateSchema),
  deviceController.updateDevice,
);
router.delete("/:id", deviceController.deleteDevice);
router.delete("/", deviceController.deleteAllDevices);

// temp
router.put("/temp", deviceController.tempUpdate);

export default router;
