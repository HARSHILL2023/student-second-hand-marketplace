"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CategoryImage, priceText } from "@/components/ProductImage";
import { api } from "@/lib/apiClient";
import { useRequireAuth } from "@/components/UserProvider";

export default function MyListingsPage() {
  const { user, loading: sessionLoading } = useRequireAuth();

  const [listings, setListings] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api("/api/listings?mine=1");
      setListings(data.listings);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
      setListings([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function handleDelete(product) {
    const sure = window.confirm("Delete the listing '" + product.name + "'?");
    if (!sure) return;

    setBusyId(product.id);

    try {
      await api("/api/listings/" + product.id, { method: "DELETE" });
      setListings((items) => items.filter((item) => item.id !== product.id));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setBusyId("");
    }
  }

  async function handleStatusChange(product, newStatus) {
    setBusyId(product.id);

    try {
      const data = await api("/api/listings/" + product.id, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setListings((items) =>
        items.map((item) =>
          item.id === product.id ? { ...item, status: data.listing.status } : item
        )
      );
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setBusyId("");
    }
  }

  if (sessionLoading || !user || listings === null) {
    return <p className="loading">Loading your listings...</p>;
  }

  const activeCount = listings.filter((item) => item.status === "available").length;
  const reservedCount = listings.filter((item) => item.status === "reserved").length;
  const soldCount = listings.filter((item) => item.status === "sold").length;

  return (
    <div>
      <h2>My Listings</h2>
      <p className="page-intro">Manage everything you have listed on the marketplace.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="stats">
        <div className="stat">
          <strong>{activeCount}</strong>
          <span>Active</span>
        </div>
        <div className="stat">
          <strong>{reservedCount}</strong>
          <span>Reserved</span>
        </div>
        <div className="stat">
          <strong>{soldCount}</strong>
          <span>Sold</span>
        </div>
        <div className="stat">
          <strong>{listings.length}</strong>
          <span>Total Listings</span>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="empty">
          You have not listed anything yet. <Link href="/create">Create your first listing</Link>.
        </div>
      ) : (
        listings.map((product) => (
          <div className="listing-row" key={product.id}>
            <div className="thumb">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <CategoryImage category={product.category} />
              )}
            </div>

            <div className="info">
              <h3>
                <Link href={"/products/" + product.id}>{product.name}</Link>
              </h3>
              <p className="muted" style={{ margin: "0 0 6px" }}>
                {priceText(product)} &middot; {product.category} &middot; {product.condition}
              </p>
              <span className={"badge status-" + product.status}>{product.status}</span>
            </div>

            <div className="actions">
              <Link className="btn btn-small btn-outline" href={"/edit/" + product.id}>
                Edit
              </Link>

              <select
                className="select-sm"
                value={product.status}
                aria-label={"Status of " + product.name}
                disabled={busyId === product.id}
                onChange={(event) => handleStatusChange(product, event.target.value)}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                className="btn btn-small btn-outline"
                disabled={busyId === product.id}
                onClick={() =>
                  handleStatusChange(
                    product,
                    product.status === "inactive" ? "available" : "inactive"
                  )
                }
              >
                {product.status === "inactive" ? "Reactivate" : "Deactivate"}
              </button>

              <button
                type="button"
                className="btn btn-small btn-danger"
                disabled={busyId === product.id}
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
