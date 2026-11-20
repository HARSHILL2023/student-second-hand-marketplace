import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Favorite from "@/lib/models/Favorite";
import Listing from "@/lib/models/Listing";
import { requireUser } from "@/lib/auth";
import { listingJSON } from "@/lib/serialize";

// GET /api/favorites - the logged in user's saved listings.
export async function GET() {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  try {
    await connectDB();

    const favorites = await Favorite.find({ userId: auth.user._id })
      .sort({ createdAt: -1 })
      .lean();
    const listingIds = favorites.map((favorite) => favorite.listingId);
    const listings = await Listing.find({ _id: { $in: listingIds } }).lean();
    const byId = new Map(listings.map((listing) => [listing._id.toString(), listing]));

    const items = listingIds
      .map((listingId) => byId.get(listingId.toString()))
      .filter(Boolean)
      .map((listing) => listingJSON(listing, listingIds.map(String)));

    return NextResponse.json({
      favorites: items,
      ids: items.map((item) => item.id),
    });
  } catch (error) {
    console.error("List favorites error:", error.message);
    return NextResponse.json(
      { error: "Could not load your favorites." },
      { status: 500 }
    );
  }
}

// POST /api/favorites { listingId }
export async function POST(request) {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  const body = await request.json().catch(() => null);
  const listingId = body && typeof body.listingId === "string" ? body.listingId : "";

  if (!/^[a-f\d]{24}$/i.test(listingId)) {
    return NextResponse.json({ error: "Invalid listing id." }, { status: 400 });
  }

  try {
    await connectDB();

    const listing = await Listing.findById(listingId).select("_id");

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    // The unique index also protects against double clicks.
    await Favorite.updateOne(
      { userId: auth.user._id, listingId: listing._id },
      { $setOnInsert: { userId: auth.user._id, listingId: listing._id } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, favorite: true }, { status: 201 });
  } catch (error) {
    if (error && error.code === 11000) {
      return NextResponse.json({ ok: true, favorite: true });
    }

    console.error("Add favorite error:", error.message);
    return NextResponse.json(
      { error: "Could not save this favorite." },
      { status: 500 }
    );
  }
}
