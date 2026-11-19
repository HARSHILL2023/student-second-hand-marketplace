"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CategoryImage, priceText } from "@/components/ProductImage";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { CURRENT_USER_ID, sellers } from "@/lib/data";
import { useMarketplace } from "@/lib/store";

export default function SellerProfilePage() {
  const params = useParams();
  const { data } = useMarketplace();

  const seller = sellers[params.id];

  if (!data) {
    return <p className="loading">Loading profile...</p>;
  }

  if (!seller) {
    return (
      <div>
        <h2>Seller not found</h2>
        <p className="page-intro">There is no student profile for this link.</p>
        <Link className="btn" href="/">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const sellerProducts = data.products
    .filter((product) => product.sellerId === seller.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeListings = sellerProducts.filter((product) => product.status === "available");
  const historyListings = sellerProducts.filter((product) => product.status !== "available");

  return (
    <div>
      <h2>{seller.name}</h2>
      <p className="page-intro">
        {seller.id === CURRENT_USER_ID ? "Your seller profile" : "Student seller profile"}
      </p>

      <div className="panel panel-green">
        <div className="info-list" style={{ margin: "0 0 2px" }}>
          <p className="info-item">
            <span>
              <strong>Year &amp; Branch:</strong> {seller.year} - {seller.branch}
            </span>
          </p>
          <p className="info-item">
            <MailIcon />
            <span>{seller.email}</span>
          </p>
          <p className="info-item">
            <PhoneIcon />
            <span>{seller.phone}</span>
          </p>
          <p className="info-item">
            <PinIcon />
            <span>{seller.hostel}</span>
          </p>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <strong>{activeListings.length}</strong>
          <span>Active Listings</span>
        </div>
        <div className="stat">
          <strong>{historyListings.length}</strong>
          <span>Past Listings</span>
        </div>
        <div className="stat">
          <strong>{sellerProducts.length}</strong>
          <span>Total Listings</span>
        </div>
      </div>

      <h3>Active Listings</h3>
      {activeListings.length === 0 ? (
        <div className="empty">This seller has no active listings right now.</div>
      ) : (
        <div className="product-grid">
          {activeListings.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={data.favorites.includes(product.id)}
            />
          ))}
        </div>
      )}

      <h3>Listing History</h3>
      {historyListings.length === 0 ? (
        <div className="empty">No reserved or sold listings yet.</div>
      ) : (
        historyListings.map((product) => (
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
              <p className="muted" style={{ margin: 0 }}>
                {priceText(product)} &middot; {product.category}
              </p>
            </div>
            <span className={"badge status-" + product.status}>{product.status}</span>
          </div>
        ))
      )}
    </div>
  );
}
