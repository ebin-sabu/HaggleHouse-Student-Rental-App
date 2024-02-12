import express from "express";

import { createUser, loginUser, makeBid, getAllBids, removeBid, toFav, getAllFavorites, getLandlordProperties } from "../controllers/userCont.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/bid", makeBid);
router.post("/myBids", getAllBids);
router.post("/removeBid", removeBid);
router.post("/toFav/:rid", toFav);
router.post("/allFav", getAllFavorites);
router.post("/myProperty/:id", getLandlordProperties);

export { router as userRoute };