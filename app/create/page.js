"use client";

import { useRouter } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { CURRENT_USER_ID } from "@/lib/data";
import { addProduct, makeId, useMarketplace } from "@/lib/store";

export default function CreateListingPage() {
  const router = useRouter();
  const { update } = useMarketplace();

  function handleCreate(values) {
    const product = {
      id: makeId("p"),
      ...values,
      status: "available",
      sellerId: CURRENT_USER_ID,
      createdAt: new Date().toISOString(),
    };

    addProduct(update, product);
    router.push("/my-listings");
  }

  return (
    <div>
      <h2>Create a Listing</h2>
      <p className="page-intro">
        Add an item you want to sell, give away for free, or exchange.
      </p>

      <div className="form-page">
        <ListingForm onSubmit={handleCreate} submitLabel="Publish Listing" />
      </div>
    </div>
  );
}
