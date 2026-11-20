import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Listing from "@/lib/models/Listing";
import { getCurrentUser } from "@/lib/auth";
import { listingJSON, publicUser } from "@/lib/serialize";

// GET /api/users/[id] - public seller profile and their listings.
// Private fields (email, password) are never returned.
export async function GET(request, context) {
  const { id } = await context.params;

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Seller not found." }, { status: 404 });
  }

  try {
    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "Seller not found." }, { status: 404 });
    }

    const viewer = await getCurrentUser();
    const isOwner = Boolean(viewer) && viewer._id.toString() === id;
    const query = { sellerId: user._id };

    // Inactive listings are private to their owner.
    if (!isOwner) query.status = { $ne: "inactive" };

    const listings = await Listing.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      seller: publicUser(user),
      listings: listings.map((listing) => listingJSON(listing)),
    });
  } catch (error) {
    console.error("Get seller error:", error.message);
    return NextResponse.json(
      { error: "Could not load this seller." },
      { status: 500 }
    );
  }
}
