import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/lib/models/Enquiry";
import { requireUser } from "@/lib/auth";
import { enquiryJSON } from "@/lib/serialize";
import { cleanString } from "@/lib/validation";
import { ENQUIRY_STATUSES } from "@/lib/constants";

// PATCH /api/enquiries/[id] - the seller accepts or rejects an enquiry.
export async function PATCH(request, context) {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  const { id } = await context.params;

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = body.status;
  const response = cleanString(body.response);

  if (status !== "accepted" && status !== "rejected") {
    return NextResponse.json(
      { error: "Please accept or reject the enquiry." },
      { status: 400 }
    );
  }

  if (!ENQUIRY_STATUSES.includes(status) || response.length > 500) {
    return NextResponse.json({ error: "Invalid response." }, { status: 400 });
  }

  try {
    await connectDB();

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }

    if (enquiry.sellerId.toString() !== auth.user._id.toString()) {
      return NextResponse.json(
        { error: "Only the seller can answer this enquiry." },
        { status: 403 }
      );
    }

    enquiry.status = status;
    enquiry.response = response;
    await enquiry.save();

    return NextResponse.json({ enquiry: enquiryJSON(enquiry) });
  } catch (error) {
    console.error("Respond to enquiry error:", error.message);
    return NextResponse.json(
      { error: "Could not save your response." },
      { status: 500 }
    );
  }
}
