import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/lib/models/Listing";
import Favorite from "@/lib/models/Favorite";
import Enquiry from "@/lib/models/Enquiry";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { listingJSON, publicUser } from "@/lib/serialize";
import { readListingInput } from "@/lib/listingInput";

const OBJECT_ID = /^[a-f\d]{24}$/i;

// GET /api/listings/[id]
export async function GET(request, context) {
  const { id } = await context.params;

  if (!OBJECT_ID.test(id)) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  try {
    await connectDB();

    const listing = await Listing.findById(id).populate(
      "sellerId",
      "name phone createdAt"
    );

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    const [similar, viewer] = await Promise.all([
      Listing.find({
        category: listing.category,
        status: "available",
        _id: { $ne: listing._id },
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      getCurrentUser(),
    ]);

    let isFavorite = false;

    if (viewer) {
      const favorite = await Favorite.exists({
        userId: viewer._id,
        listingId: listing._id,
      });
      isFavorite = Boolean(favorite);
    }

    return NextResponse.json({
      listing: listingJSON(listing, isFavorite ? [listing._id.toString()] : []),
      seller: publicUser(listing.sellerId),
      similar: similar.map((item) => listingJSON(item)),
      isFavorite,
    });
  } catch (error) {
    console.error("Get listing error:", error.message);
    return NextResponse.json(
      { error: "Could not load this listing." },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/[id] - only the seller who created it can edit.
export async function PATCH(request, context) {
  const { id } = await context.params;

  if (!OBJECT_ID.test(id)) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const auth = await requireUser();

  if (auth.response) return auth.response;

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = readListingInput(body, { partial: true });

  if (input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  try {
    await connectDB();

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    if (listing.sellerId.toString() !== auth.user._id.toString()) {
      return NextResponse.json(
        { error: "You can only edit your own listings." },
        { status: 403 }
      );
    }

    Object.assign(listing, input.values);
    await listing.save();

    return NextResponse.json({ listing: listingJSON(listing) });
  } catch (error) {
    console.error("Update listing error:", error.message);
    return NextResponse.json(
      { error: "Could not save the listing." },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - removes the listing and its related records.
export async function DELETE(request, context) {
  const { id } = await context.params;

  if (!OBJECT_ID.test(id)) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const auth = await requireUser();

  if (auth.response) return auth.response;

  try {
    await connectDB();

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    if (listing.sellerId.toString() !== auth.user._id.toString()) {
      return NextResponse.json(
        { error: "You can only delete your own listings." },
        { status: 403 }
      );
    }

    await Promise.all([
      Favorite.deleteMany({ listingId: listing._id }),
      Enquiry.deleteMany({ listingId: listing._id }),
      listing.deleteOne(),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete listing error:", error.message);
    return NextResponse.json(
      { error: "Could not delete the listing." },
      { status: 500 }
    );
  }
}
