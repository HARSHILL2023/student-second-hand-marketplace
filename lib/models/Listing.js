import mongoose from "mongoose";
import {
  CATEGORIES,
  CONDITIONS,
  LISTING_STATUSES,
  LISTING_TYPES,
} from "../constants";

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    condition: {
      type: String,
      enum: CONDITIONS,
      required: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    listingType: {
      type: String,
      enum: LISTING_TYPES,
      default: "For Sale",
    },
    status: {
      type: String,
      enum: LISTING_STATUSES,
      default: "available",
    },
  },
  { timestamps: true }
);

// Common queries: the public marketplace and a seller's own listings.
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ sellerId: 1, createdAt: -1 });

export default mongoose.models.Listing || mongoose.model("Listing", listingSchema);
