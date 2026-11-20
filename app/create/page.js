"use client";

import { useRouter } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { api } from "@/lib/apiClient";
import { useRequireAuth } from "@/components/UserProvider";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  async function handleCreate(values) {
    await api("/api/listings", { method: "POST", body: values });
    router.push("/my-listings");
  }

  if (loading || !user) {
    return <p className="loading">Checking your session...</p>;
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
