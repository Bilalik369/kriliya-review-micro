import express from "express"
import {createReview , getItemReviews , getUserReviews , getReviewsByReviewer ,getReviewById,updateReview } from "../controllers/review.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"



const router = express.Router()


router.post("/" ,authMiddleware , createReview) 
router.get("/my-reviews", authMiddleware, getReviewsByReviewer)
router.get("/:reviewId", authMiddleware, getReviewById)
router.put("/:reviewId", authMiddleware, updateReview )


router.get("/item/:itemId", getItemReviews)
router.get("/user/:userId", getUserReviews)






export default router; 