import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

// The same user cannot save the same listing twice.
favoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
