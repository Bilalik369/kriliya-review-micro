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

export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    const filter = {
      itemId,
      reviewType: "item",
      isVisible: true,
    };

    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const reviews = await Review.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(filter);

    const stats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    const ratingStats = stats[0] || {
      averageRating: 0,
      totalReviews: 0,
    };

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (ratingStats.ratingDistribution) {
      ratingStats.ratingDistribution.forEach((rating) => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }

    return res.status(200).json( {
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalReviews: count,
      averageRating: ratingStats.averageRating ? Math.round(ratingStats.averageRating * 10) / 10 : 0,
      ratingDistribution: distribution,
    });


  } catch (error) {
    console.error(" Get item reviews error:", error);
    return res.status(500).json({msg : "Failed to fetch reviews"})
  }
};
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, reviewType } = req.query;

    const filter = {
      revieweeId: userId,
      isVisible: true,
    };

    if (reviewType) {
      filter.reviewType = reviewType;
    }

    const review = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);


    const count = await Review.countDocuments(filter);

 
    const stats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const ratingStats = stats[0] || {
      averageRating: 0,
      totalReviews: 0,
    };

   
    return res.status(200).json({
      review,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalReviews: count,
      averageRating: ratingStats.averageRating
        ? Math.round(ratingStats.averageRating * 10) / 10
        : 0,
    });

  } catch (error) {
    console.error("Get user reviews error:", error);
    return res.status(500).json({ msg: "Failed to fetch reviews" });
  }
};

export const getReviewsByReviewer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ reviewerId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ reviewerId: req.user.userId });

    return res.status(200).json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalReviews: count,
    });
  } catch (error) {
    console.error("Get reviews by reviewer error:", error);
    return res.status(500).json({ msg: "Failed to fetch reviews" });
  }
};


export const getReviewById = async (req, res) => {
  try {
   
    const { reviewId } = req.params

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    return res.status(200).json(review);

  } catch (error) {

    console.error("Get review by ID error:", error);
    return res.status(500).json({ msg: "Failed to fetch review" });
  }
};

export const updateReview  =async(req , res)=>{
    try {
        const {reviewId} = req.params;
        const {rating , title , comment , photos , aspects} = req.body;

        const review = await Review.findById(reviewId)

        if(!review){
            return res.status(200).json({msg : " Review not found"})
        }
        if(review.reviewerId.toString() !== req.user.userId && req.user.role !== "admin"){
            return res.status(403).json({msg : "You are not authorized to update this review"})
        }
        if(rating) review.rating = rating;
        if(title) review.title = title;
        if(comment) review.comment  = comment;
        if(photos) review.photos = photos;
        if (aspects) review.aspects = { ...review.aspects, ...aspects };
        
        await review.save();

        return res.status(201).json({
            msg:" Review updated successfully",
            review
        })

    } catch (error) {
         console.error("Update review error:", error);
         return res.status(500).json({ msg: "Failed to update review" });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ msg: "Review not found" });
        }

        if (review.reviewerId.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ msg: "You are not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).json({ msg: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error);
        return res.status(500).json({ msg: "Failed to delete review" });
    }
};
export const addResponse = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ msg: "Review not found" });
        }

        if (review.revieweeId.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only the reviewee can respond to this review" });
        }

        review.response = {
            comment,
            respondedAt: new Date()
        };

        await review.save();

        return res.status(201).json({ review, msg: "Response added successfully" });
    } catch (error) {
        console.error("Add response error:", error);
        return res.status(500).json({ msg: "Failed to add response" });
    }
};

export const markHelpful = async(req , res)=>{
    try {
        const {reviewId } = req.params

        const review =await Review.findById(reviewId)

        if(!review){
            return res.status(404).json({msg: "review not found"})
        }

        review.helpfulCount += 1

        await review.save();

        return res.status(201).json({review , msg: "Review marked as helpful"})
         

    } catch (error) {
        console.error("Add helpfuk error:", error);
        return res.status(500).json({ msg: "Failed to add hekpful" });
    }
}