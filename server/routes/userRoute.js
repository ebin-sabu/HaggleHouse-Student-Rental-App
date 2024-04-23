import express from "express";

import {
    createUserWithProfilePic, loginUser, makeBid, getAllBids, removeBid, toFav, getAllFavorites, getLandlordProperties, acceptBid, rejectBid, getAllBidsOnProperty,
    createGroup, joinGroup, getGroup, leaveGroup
} from "../controllers/userCont.js";

const router = express.Router();

router.post("/register", createUserWithProfilePic);
router.post("/login", loginUser);
router.post("/bid", makeBid);
router.post("/myBids", getAllBids);
router.post("/removeBid", removeBid);
router.post("/toFav/:rid", toFav);
router.post("/allFav", getAllFavorites);
router.post("/myProperty/:id", getLandlordProperties);
router.post("/createGroup", createGroup);
router.post("/joinGroup", joinGroup);
router.post("/getMyGroup", getGroup);
router.post("/leaveGroup", leaveGroup);
router.post("/acceptBid", acceptBid);
router.post("/rejectBid", rejectBid);
router.get("/allbids/:propertyId", getAllBidsOnProperty);


export { router as userRoute };