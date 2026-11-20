import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/lib/models/Enquiry";
import Listing from "@/lib/models/Listing";
import { requireUser } from "@/lib/auth";
import { enquiryJSON } from "@/lib/serialize";
import { cleanString, toNumber } from "@/lib/validation";

// GET /api/enquiries - enquiries received on my listings and ones I sent.
export async function GET() {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  try {
    await connectDB();

    const [received, sent] = await Promise.all([
      Enquiry.find({ sellerId: auth.user._id })
        .sort({ createdAt: -1 })
        .populate("buyerId", "name")
        .populate("listingId", "name status")
        .lean(),
      Enquiry.find({ buyerId: auth.user._id })
        .sort({ createdAt: -1 })
        .populate("listingId", "name status")
        .populate("sellerId", "name")
        .lean(),
    ]);

    return NextResponse.json({
      received: received.map(enquiryJSON),
      sent: sent.map(enquiryJSON),
    });
  } catch (error) {
    console.error("List enquiries error:", error.message);
    return NextResponse.json(
      { error: "Could not load enquiries." },
      { status: 500 }
    );
  }
}

// POST /api/enquiries { listingId, message, offerPrice }
export async function POST(request) {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const listingId = typeof body.listingId === "string" ? body.listingId : "";
  const message = cleanString(body.message);
  const offerPrice = toNumber(body.offerPrice);

  if (!/^[a-f\d]{24}$/i.test(listingId)) {
    return NextResponse.json({ error: "Invalid listing id." }, { status: 400 });
  }

  if (message.length < 5 || message.length > 1000) {
    return NextResponse.json(
      { error: "Please write a message (5 to 1000 characters)." },
      { status: 400 }
    );
  }

  if (offerPrice !== null && offerPrice < 0) {
    return NextResponse.json(
      { error: "Please enter a valid offer amount." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const listing = await Listing.findById(listingId).select(
      "sellerId status name"
    );

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    if (listing.sellerId.toString() === auth.user._id.toString()) {
      return NextResponse.json(
        { error: "You cannot send an enquiry on your own listing." },
        { status: 400 }
      );
    }

    if (listing.status !== "available") {
      return NextResponse.json(
        { error: "This item is no longer available for enquiries." },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create({
      buyerId: auth.user._id,
      sellerId: listing.sellerId,
      listingId: listing._id,
      message,
      offerPrice,
    });

    return NextResponse.json(
      { enquiry: enquiryJSON({ ...enquiry.toObject(), listingId: listing }) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create enquiry error:", error.message);
    return NextResponse.json(
      { error: "Could not send your enquiry." },
      { status: 500 }
    );
  }
}
