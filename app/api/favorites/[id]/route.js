import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Favorite from "@/lib/models/Favorite";
import { requireUser } from "@/lib/auth";

// DELETE /api/favorites/[id] - [id] is the listing id.
export async function DELETE(request, context) {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  const { id } = await context.params;

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid listing id." }, { status: 400 });
  }

  try {
    await connectDB();

    await Favorite.deleteOne({ userId: auth.user._id, listingId: id });

    return NextResponse.json({ ok: true, favorite: false });
  } catch (error) {
    console.error("Remove favorite error:", error.message);
    return NextResponse.json(
      { error: "Could not remove this favorite." },
      { status: 500 }
    );
  }
}
