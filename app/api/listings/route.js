import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/lib/models/Listing";
import Favorite from "@/lib/models/Favorite";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { listingJSON } from "@/lib/serialize";
import { readListingInput } from "@/lib/listingInput";
import { cleanString, escapeRegex, toNumber } from "@/lib/validation";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";

// GET /api/listings
// Public: available listings with search, filters and sorting.
// ?mine=1: the logged in user's own listings (all statuses).
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine") === "1";
    let user = null;

    if (mine) {
      const auth = await requireUser();

      if (auth.response) return auth.response;

      user = auth.user;
    }

    const query = {};

    if (mine) {
      query.sellerId = user._id;
    } else {
      // The marketplace only shows items that are still for sale.
      query.status = "available";

      const sellerId = cleanString(searchParams.get("seller"));

      if (sellerId) {
        if (!/^[a-f\d]{24}$/i.test(sellerId)) {
          return NextResponse.json({ error: "Invalid seller id." }, { status: 400 });
        }

        query.sellerId = sellerId;
      }
    }

    const search = cleanString(searchParams.get("search")).slice(0, 100);

    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: pattern }, { description: pattern }];
    }

    const category = searchParams.get("category");

    if (category && category !== "All") {
      if (!CATEGORIES.includes(category)) {
        return NextResponse.json({ error: "Invalid category." }, { status: 400 });
      }

      query.category = category;
    }

    const condition = searchParams.get("condition");

    if (condition && condition !== "All") {
      if (!CONDITIONS.includes(condition)) {
        return NextResponse.json({ error: "Invalid condition." }, { status: 400 });
      }

      query.condition = condition;
    }

    const minPrice = toNumber(searchParams.get("minPrice"));
    const maxPrice = toNumber(searchParams.get("maxPrice"));

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};

      if (minPrice !== null) query.price.$gte = Math.max(0, minPrice);
      if (maxPrice !== null) query.price.$lte = Math.max(0, maxPrice);
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-low": { price: 1, createdAt: -1 },
      "price-high": { price: -1, createdAt: -1 },
    };
    const sort = sortOptions[searchParams.get("sort")] || sortOptions.newest;

    const listings = await Listing.find(query)
      .sort(sort)
      .limit(mine ? 200 : 100)
      .lean();

    // The viewer's favorites are used to draw the filled star.
    const viewer = mine ? user : await getCurrentUser();
    let favoriteIds = [];

    if (viewer) {
      const favorites = await Favorite.find({ userId: viewer._id })
        .select("listingId")
        .lean();
      favoriteIds = favorites.map((favorite) => favorite.listingId.toString());
    }

    return NextResponse.json({
      listings: listings.map((listing) => listingJSON(listing, favoriteIds)),
    });
  } catch (error) {
    console.error("List listings error:", error.message);
    return NextResponse.json(
      { error: "Could not load listings. Please try again." },
      { status: 500 }
    );
  }
}

// POST /api/listings
export async function POST(request) {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = readListingInput(body);

  if (input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  try {
    await connectDB();

    const listing = await Listing.create({
      ...input.values,
      sellerId: auth.user._id,
      status: "available",
    });

    return NextResponse.json({ listing: listingJSON(listing) }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error.message);
    return NextResponse.json(
      { error: "Could not create the listing. Please try again." },
      { status: 500 }
    );
  }
}
