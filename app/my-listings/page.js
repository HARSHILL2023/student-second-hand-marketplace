"use client";

import Link from "next/link";
import { CategoryImage, priceText } from "@/components/ProductImage";
import { CURRENT_USER_ID } from "@/lib/data";
import { editProduct, removeProduct, useMarketplace } from "@/lib/store";

export default function MyListingsPage() {
  const { data, update } = useMarketplace();

  if (!data) {
    return <p className="loading">Loading your listings...</p>;
  }

  const myProducts = data.products
    .filter((product) => product.sellerId === CURRENT_USER_ID)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeCount = myProducts.filter((product) => product.status === "available").length;
  const reservedCount = myProducts.filter((product) => product.status === "reserved").length;
  const soldCount = myProducts.filter((product) => product.status === "sold").length;

  function handleDelete(product) {
    const sure = window.confirm("Delete the listing '" + product.name + "'?");
    if (sure) removeProduct(update, product.id);
  }

  function handleStatusChange(product, newStatus) {
    editProduct(update, product.id, { status: newStatus });
  }

  return (
    <div>
      <h2>My Listings</h2>
      <p className="page-intro">Manage everything you have listed on the marketplace.</p>

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
          <strong>{myProducts.length}</strong>
          <span>Total Listings</span>
        </div>
      </div>

      {myProducts.length === 0 ? (
        <div className="empty">
          You have not listed anything yet. <Link href="/create">Create your first listing</Link>.
        </div>
      ) : (
        myProducts.map((product) => (
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
