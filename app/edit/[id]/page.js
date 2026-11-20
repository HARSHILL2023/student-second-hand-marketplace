"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { api } from "@/lib/apiClient";
import { useRequireAuth } from "@/components/UserProvider";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: sessionLoading } = useRequireAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api("/api/listings/" + params.id)
      .then((data) => {
        if (active) setListing(data.listing);
      })
      .catch((loadError) => {
        if (!active) return;

        if (/not found/i.test(loadError.message)) {
          setNotFound(true);
        } else {
          setError(loadError.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleSave(values) {
    await api("/api/listings/" + params.id, { method: "PATCH", body: values });
    router.push("/my-listings");
  }

  if (sessionLoading || loading || !user) {
    return <p className="loading">Loading listing...</p>;
  }

  if (notFound) {
    return (
      <div>
        <h2>Listing not found</h2>
        <p className="page-intro">This listing may have been deleted.</p>
        <Link className="btn" href="/my-listings">
          Back to My Listings
        </Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div>
        <h2>Could not load the listing</h2>
        {error && <p className="form-error">{error}</p>}
        <Link className="btn" href="/my-listings">
          Back to My Listings
        </Link>
      </div>
    );
  }

  if (listing.sellerId !== user.id) {
    return (
      <div>
        <h2>Not allowed</h2>
        <p className="page-intro">You can only edit your own listings.</p>
        <Link className="btn" href="/my-listings">
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Edit Listing</h2>
      <p className="page-intro">Change the details of your listing and save.</p>

      <div className="form-page">
        <ListingForm
          initialValues={listing}
          onSubmit={handleSave}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
