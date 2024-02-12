import express from "express";
import { createProperty, getAllProperties, getProperty } from "../controllers/propertyCont.js";

const router = express.Router();

router.post("/create", createProperty)
router.get("/allProps", getAllProperties)
router.get("/:id", getProperty)

export { router as propertyRoute }