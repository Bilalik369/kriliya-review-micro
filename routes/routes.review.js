import express from "express"
import {createReview} from "../controllers/review.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"



const router = express.Router()


router.post("/" ,authMiddleware , createReview) 


export default router; 