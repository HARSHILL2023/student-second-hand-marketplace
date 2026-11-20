// Adds demo accounts and listings to an empty database.
// Run it with: npm run seed
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/User.js";
import Listing from "../lib/models/Listing.js";
import { SEED_PASSWORD, sampleListings, seedSellers } from "../lib/data.js";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(
    "MONGODB_URI is not set. Add it to .env.local or run the script from an environment that has it."
  );
  process.exit(1);
}

try {
  await mongoose.connect(uri);

  const existing = await Listing.countDocuments();

  if (existing > 0) {
    console.log("The database already has " + existing + " listings, so nothing was added.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const userIds = {};

  for (const seller of seedSellers) {
    let user = await User.findOne({ email: seller.email });

    if (!user) {
      user = await User.create({
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        password: passwordHash,
      });
    }

    userIds[seller.key] = user._id;
  }

  const listings = sampleListings.map((listing) => {
    const { sellerKey, ...fields } = listing;
    return { ...fields, sellerId: userIds[sellerKey] };
  });

  await Listing.insertMany(listings);

  console.log("Seed finished: " + seedSellers.length + " users and " + listings.length + " listings.");
  console.log("Log in with any of these accounts and the password: " + SEED_PASSWORD);

  for (const seller of seedSellers) {
    console.log("  " + seller.email + "  (" + seller.name + ")");
  }

  await mongoose.disconnect();
} catch (error) {
  console.error("Seeding failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
}
