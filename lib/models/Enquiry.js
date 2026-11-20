import mongoose from "mongoose";
import { ENQUIRY_STATUSES } from "../constants.js";

const enquirySchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    offerPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: "pending",
    },
    response: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

enquirySchema.index({ sellerId: 1, createdAt: -1 });
enquirySchema.index({ buyerId: 1, createdAt: -1 });
enquirySchema.index({ listingId: 1 });

export default mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
