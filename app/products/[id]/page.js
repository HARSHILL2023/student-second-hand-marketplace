"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CategoryImage, priceText } from "@/components/ProductImage";
import { MailIcon, PhoneIcon, PinIcon, StarIcon } from "@/components/Icons";
import { CURRENT_USER_ID, sellers } from "@/lib/data";
import { addEnquiry, makeId, toggleFavorite, useMarketplace } from "@/lib/store";

export default function ProductDetailsPage() {
  const params = useParams();
  const { data, update } = useMarketplace();

  const [buyerName, setBuyerName] = useState("You (Demo Student)");
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!data) {
    return <p className="loading">Loading product...</p>;
  }

  const product = data.products.find((item) => item.id === params.id);

  if (!product) {
    return (
      <div>
        <h2>Product not found</h2>
        <p className="page-intro">This listing may have been deleted or the link is wrong.</p>
        <Link className="btn" href="/">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const seller = sellers[product.sellerId] || {
    name: "Unknown Seller",
    year: "-",
    branch: "-",
    email: "-",
    phone: "-",
    hostel: "-",
  };

  const isFavorite = data.favorites.includes(product.id);
  const isOwnListing = product.sellerId === CURRENT_USER_ID;

  // Similar products = same category, still available, not this one.
  const similarProducts = data.products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id &&
        item.status === "available"
    )
    .slice(0, 3);

  function handleEnquirySubmit(event) {
    event.preventDefault();

    if (message.trim() === "") {
      setError("Please write a short message for the seller.");
      return;
    }

    if (offer !== "" && Number(offer) <= 0) {
      setError("Please enter a valid offer amount, or leave the field empty.");
      return;
    }

    setError("");

    const enquiry = {
      id: makeId("e"),
      productId: product.id,
      buyerName: buyerName.trim() || "Anonymous Student",
      buyerId: CURRENT_USER_ID,
      message: message.trim(),
      offer: offer === "" ? null : Number(offer),
      status: "pending",
      response: "",
      createdAt: new Date().toISOString(),
    };

    addEnquiry(update, enquiry);

    setMessage("");
    setOffer("");
    setSubmitted(true);
  }

  return (
    <div>
      <Link className="back-link" href="/">
        &larr; Back to marketplace
      </Link>

      <div className="detail-layout">
        <div>
          <div className="detail-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <CategoryImage category={product.category} />
            )}
          </div>

          <h2>{product.name}</h2>
          <p className="price-lg">{priceText(product)}</p>

          <div className="badge-row">
            <span className="badge">{product.category}</span>
            <span className="badge">Condition: {product.condition}</span>
            <span className="badge">{product.listingType}</span>
            <span className={"badge status-" + product.status}>{product.status}</span>
          </div>

          <h3>Description</h3>
          <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>

          <p className="muted">
            Listed on {new Date(product.createdAt).toLocaleDateString()}
          </p>

          <button
            type="button"
            className="btn btn-outline"
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(update, product.id)}
          >
            <StarIcon filled={isFavorite} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>

          {similarProducts.length > 0 && (
            <div>
              <h3>Similar Products</h3>
              <div className="product-grid">
                {similarProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Seller information */}
          <div className="panel panel-green">
            <h3>Seller Information</h3>
            <p style={{ margin: "0 0 2px" }}>
              <strong>{seller.name}</strong>
            </p>
            <p className="muted" style={{ margin: 0 }}>
              {seller.year} - {seller.branch}
            </p>

            <div className="info-list">
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

            <Link className="btn btn-small" href={"/seller/" + product.sellerId}>
              View Seller Profile
            </Link>
          </div>

          {/* Enquiry form */}
          <div className="panel">
            <h3>Send an Enquiry</h3>

            {isOwnListing ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                This is your own listing. You cannot send an enquiry on it.
              </p>
            ) : product.status !== "available" ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                This item is currently {product.status}, so enquiries are closed.
              </p>
            ) : (
              <>
                <p className="muted">
                  Ask the seller a question. You can also offer a lower price (optional).
                </p>

                <form className="form" onSubmit={handleEnquirySubmit}>
                  <div className="form-row">
                    <label htmlFor="enquiry-name">Your Name</label>
                    <input
                      id="enquiry-name"
                      type="text"
                      value={buyerName}
                      onChange={(event) => setBuyerName(event.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="enquiry-message">Message</label>
                    <textarea
                      id="enquiry-message"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Is this item still available?"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="enquiry-offer">Price Offer (optional)</label>
                    <input
                      id="enquiry-offer"
                      type="number"
                      min="0"
                      placeholder={"Listed price: " + priceText(product)}
                      value={offer}
                      onChange={(event) => setOffer(event.target.value)}
                    />
                    <small>Leave empty if you do not want to make an offer.</small>
                  </div>

                  {error && <p className="form-error">{error}</p>}

                  {submitted && (
                    <p className="form-success">
                      Your enquiry was sent. You can follow it on the Enquiries page.
                    </p>
                  )}

                  <div className="form-actions">
                    <button className="btn" type="submit">
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
