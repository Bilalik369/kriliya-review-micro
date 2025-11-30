import Review from "../models/Review.model.js";
import { serviceClient } from "../utils/service-client.util.js";


export const createReview = async (req, res) => {
  try {
    const {
      bookingId,
      itemId,
      revieweeId,
      reviewType,
      rating,
      title,
      comment,
      photos,
      aspects
    } = req.body

    let booking


    try {
      booking = await serviceClient.getBooking(bookingId)
    } catch (error) {
      return res.status(404).json({ msg: `Booking not found: ${error.message}` })
    }


    try {
      await serviceClient.getItem(itemId)
    } catch (error) {
      return res.status(404).json({ msg: `Item not found: ${error.message}` })
    }


    try {
      await serviceClient.getUser(revieweeId)
    } catch (error) {
      return res.status(404).json({ msg: `Reviewee not found: ${error.message}` })
    }

    
    const existingReview = await Review.findOne({
      bookingId,
      reviewerId: req.user.userId,
      reviewType,
    })

    if (existingReview) {
      return res.status(400).json({ msg: "You have already reviewed this booking" })
    }


    const review = new Review({
      bookingId,
      itemId,
      reviewerId: req.user.userId,
      revieweeId,
      reviewType,
      rating,
      title,
      comment,
      photos: photos || [],
      aspects: aspects || {},
    })

    await review.save()

    return res
      .status(201)
      .json({ msg: "Review created successfully", data: review })

  } catch (error) {
    console.error("Create review error:", error)

    if (error.code === 11000) {
      return res.status(400).json({ msg: "You have already reviewed this booking" })
    }

    return res.status(500).json({ msg: "Failed to create review" })
  }
}
