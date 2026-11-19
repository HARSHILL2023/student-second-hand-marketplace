"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { editProduct, useMarketplace } from "@/lib/store";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { data, update } = useMarketplace();

  if (!data) {
    return <p className="loading">Loading listing...</p>;
  }

  const product = data.products.find((item) => item.id === params.id);

  if (!product) {
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

  function handleSave(values) {
    editProduct(update, product.id, values);
    router.push("/my-listings");
  }

  return (
    <div>
      <h2>Edit Listing</h2>
      <p className="page-intro">Change the details of your listing and save.</p>

      <div className="form-page">
        <ListingForm
          initialValues={product}
          onSubmit={handleSave}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
