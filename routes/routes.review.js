import express from "express"
import {createReview , getItemReviews} from "../controllers/review.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"



const router = express.Router()


router.post("/" ,authMiddleware , createReview) 


router.get("/item/:itemId", getItemReviews) 


export default router; 