import express from "express";
import { createProperty, getAllProperties, getPropertiesByLandlord, patchProperty, getProperty } from "../controllers/propertyCont.js";
import upload from '../config/multerConfig.js';
import { protect } from '../controllers/userCont.js';

const router = express.Router();

router.post('/create', upload.array('images', 5), createProperty);
router.get("/allProps", getAllProperties);
router.get('/my/:id', getProperty);
router.get("/myProperty/:userId", protect, getPropertiesByLandlord);
router.patch('/update/:propertyId', protect, upload.none(), patchProperty);


export { router as propertyRoute }