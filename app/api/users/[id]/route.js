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

    const [listings, viewer] = await Promise.all([
      Listing.find({ sellerId: user._id }).sort({ createdAt: -1 }).lean(),
      getCurrentUser(),
    ]);

    return NextResponse.json({
      seller: publicUser(user),
      listings: listings.map((listing) =>
        listingJSON(listing, viewer && viewer._id.toString() === id ? [] : [])
      ),
    });
  } catch (error) {
    console.error("Get seller error:", error.message);
    return NextResponse.json(
      { error: "Could not load this seller." },
      { status: 500 }
    );
  }
}
