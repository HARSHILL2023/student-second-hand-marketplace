"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CategoryImage, priceText } from "@/components/ProductImage";
import { PhoneIcon, CalendarIcon } from "@/components/Icons";
import { api } from "@/lib/apiClient";
import { useUser } from "@/components/UserProvider";

export default function SellerProfilePage() {
  const params = useParams();
  const { user } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);

    api("/api/users/" + params.id)
      .then((result) => {
        if (active) {
          setData(result);
          setNotFound(false);
        }
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

  if (loading) {
    return <p className="loading">Loading profile...</p>;
  }

  if (notFound) {
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

  if (!data) {
    return (
      <div>
        <h2>Could not load this profile</h2>
        {error && <p className="form-error">{error}</p>}
        <Link className="btn" href="/">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const { seller, listings } = data;
  const isMe = Boolean(user) && user.id === seller.id;

  const activeListings = listings.filter((item) => item.status === "available");
  const historyListings = listings.filter((item) => item.status !== "available");

  return (
    <div>
      <h2>{seller.name}</h2>
      <p className="page-intro">{isMe ? "Your seller profile" : "Student seller profile"}</p>

      <div className="panel panel-green">
        <div className="info-list" style={{ margin: "0 0 2px" }}>
          <p className="info-item">
            <PhoneIcon />
            <span>{seller.phone || "Phone not shared"}</span>
          </p>
          <p className="info-item">
            <CalendarIcon />
            <span>
              Joined{" "}
              {seller.createdAt
                ? new Date(seller.createdAt).toLocaleDateString()
                : "-"}
            </span>
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
          <strong>{listings.length}</strong>
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
              isFavorite={product.isFavorite}
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
