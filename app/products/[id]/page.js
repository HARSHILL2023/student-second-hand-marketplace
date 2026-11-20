"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CategoryImage, priceText } from "@/components/ProductImage";
import { PhoneIcon, CalendarIcon, StarIcon } from "@/components/Icons";
import { api } from "@/lib/apiClient";
import { useUser } from "@/components/UserProvider";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: sessionLoading } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState("");
  const [enquiryError, setEnquiryError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const userId = user ? user.id : "";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api("/api/listings/" + params.id)
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
  }, [params.id, userId]);

  async function handleToggleFavorite() {
    if (!user) {
      router.push("/login");
      return;
    }

    const nextValue = !data.isFavorite;

    try {
      if (nextValue) {
        await api("/api/favorites", {
          method: "POST",
          body: { listingId: data.listing.id },
        });
      } else {
        await api("/api/favorites/" + data.listing.id, { method: "DELETE" });
      }

      setData((current) => ({ ...current, isFavorite: nextValue }));
    } catch (favoriteError) {
      setError(favoriteError.message);
    }
  }

  async function handleEnquirySubmit(event) {
    event.preventDefault();
    setEnquiryError("");

    if (message.trim() === "") {
      setEnquiryError("Please write a short message for the seller.");
      return;
    }

    if (offer !== "" && Number(offer) <= 0) {
      setEnquiryError("Please enter a valid offer amount, or leave the field empty.");
      return;
    }

    setSending(true);

    try {
      await api("/api/enquiries", {
        method: "POST",
        body: {
          listingId: data.listing.id,
          message: message.trim(),
          offerPrice: offer === "" ? null : Number(offer),
        },
      });

      setMessage("");
      setOffer("");
      setSubmitted(true);
    } catch (sendError) {
      setEnquiryError(sendError.message);
    } finally {
      setSending(false);
    }
  }

  if (loading && !data) {
    return <p className="loading">Loading product...</p>;
  }

  if (notFound) {
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

  if (!data) {
    return (
      <div>
        <h2>Could not load the product</h2>
        {error && <p className="form-error">{error}</p>}
        <Link className="btn" href="/">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const { listing: product, seller, similar } = data;
  const isOwnListing = Boolean(user) && product.sellerId === user.id;

  return (
    <div>
      <Link className="back-link" href="/">
        &larr; Back to marketplace
      </Link>

      {error && <p className="form-error">{error}</p>}

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
            aria-pressed={data.isFavorite}
            onClick={handleToggleFavorite}
            disabled={!user || sessionLoading}
            title={user ? "" : "Log in to save favorites"}
          >
            <StarIcon filled={data.isFavorite} />
            {data.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>

          {similar.length > 0 && (
            <div>
              <h3>Similar Products</h3>
              <div className="product-grid">
                {similar.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Seller information: only public fields are returned by the API. */}
          <div className="panel panel-green">
            <h3>Seller Information</h3>
            <p style={{ margin: "0 0 2px" }}>
              <strong>{seller ? seller.name : "Unknown seller"}</strong>
            </p>

            <div className="info-list">
              <p className="info-item">
                <PhoneIcon />
                <span>{seller && seller.phone ? seller.phone : "Phone not shared"}</span>
              </p>
              <p className="info-item">
                <CalendarIcon />
                <span>
                  Joined{" "}
                  {seller && seller.createdAt
                    ? new Date(seller.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </p>
            </div>

            {seller && (
              <Link className="btn btn-small" href={"/seller/" + seller.id}>
                View Seller Profile
              </Link>
            )}
          </div>

          {/* Enquiry form */}
          <div className="panel">
            <h3>Send an Enquiry</h3>

            {sessionLoading ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                Checking your session...
              </p>
            ) : isOwnListing ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                This is your own listing. You cannot send an enquiry on it.
              </p>
            ) : product.status !== "available" ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                This item is currently {product.status}, so enquiries are closed.
              </p>
            ) : !user ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                Please <Link href="/login">log in</Link> to send an enquiry to the seller.
              </p>
            ) : (
              <>
                <p className="muted">
                  Ask the seller a question. You can also offer a lower price (optional).
                  Sending as <strong>{user.name}</strong>.
                </p>

                <form className="form" onSubmit={handleEnquirySubmit}>
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

                  {enquiryError && <p className="form-error">{enquiryError}</p>}

                  {submitted && (
                    <p className="form-success">
                      Your enquiry was sent. You can follow it on the Enquiries page.
                    </p>
                  )}

                  <div className="form-actions">
                    <button className="btn" type="submit" disabled={sending}>
                      {sending ? "Sending..." : "Submit Enquiry"}
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
