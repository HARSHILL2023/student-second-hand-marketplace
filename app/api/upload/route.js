import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

// POST /api/upload - uploads one image file to Cloudinary.
// Cloudinary is optional: without credentials the route says so clearly and
// the listing is saved with a category icon instead of a broken image.
export async function POST(request) {
  const auth = await requireUser();

  if (auth.response) return auth.response;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Image upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to enable it. You can still publish without a photo.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form && form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Please choose an image file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files can be uploaded." },
      { status: 400 }
    );
  }

  // 5 MB keeps uploads small and fast for a campus marketplace.
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Please choose an image smaller than 5 MB." },
      { status: 400 }
    );
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "student-marketplace";

    // Cloudinary signed upload: sha1 of sorted params + API secret.
    const signature = crypto
      .createHash("sha1")
      .update("folder=" + folder + "&timestamp=" + timestamp + apiSecret)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("folder", folder);
    uploadForm.append("signature", signature);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
      { method: "POST", body: uploadForm }
    );
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.secure_url) {
      console.error("Cloudinary upload failed:", result.error && result.error.message);
      return NextResponse.json(
        { error: "The image could not be uploaded. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error.message);
    return NextResponse.json(
      { error: "The image could not be uploaded. Please try again." },
      { status: 500 }
    );
  }
}
