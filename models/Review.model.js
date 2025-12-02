import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, "Booking ID is required"],
    },
    itemId: {
      type: String,
      required: [true, "Item ID is required"],
    },
    reviewerId: {
      type: String,
      required: [true, "Reviewer ID is required"],
    },
    revieweeId: {
      type: String,
      required: [true, "Reviewee ID is required"],
    },
    reviewType: {
      type: String,
      enum: ["item", "renter", "owner"],
      required: [true, "Review type is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    photos: [String],
    aspects: {
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      accuracy: {
        type: Number,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
      condition: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    response: {
      comment: String,
      respondedAt: Date,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
      helpfulBy: {
         type: [String], default: []
        },
    reportCount: {
      type: Number,
      default: 0,
    },
    reportBy : {
        type : [String],
        default : []
    }
  },
  {
    timestamps: true,
  },
)



const Review = mongoose.model("Review" , reviewSchema)
export default Review