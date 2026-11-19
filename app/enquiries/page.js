"use client";

import { useState } from "react";
import Link from "next/link";
import { CURRENT_USER_ID } from "@/lib/data";
import { respondToEnquiry, useMarketplace } from "@/lib/store";

// One enquiry card. Used for both received and sent enquiries.
function EnquiryCard({ enquiry, product, received, onRespond }) {
  const [reply, setReply] = useState("");

  function handleRespond(status) {
    const note =
      reply.trim() !== ""
        ? reply.trim()
        : status === "accepted"
        ? "Offer accepted. Please collect the item at the decided time."
        : "Sorry, I cannot accept this offer.";

    onRespond(enquiry.id, status, note);
  }

  return (
    <article className="enquiry">
      <div className="enquiry-head">
        <div>
          <h3>
            {product ? (
              <Link href={"/products/" + product.id}>{product.name}</Link>
            ) : (
              "Deleted listing"
            )}
          </h3>
          <p className="muted" style={{ margin: 0 }}>
            From: <strong>{enquiry.buyerName}</strong> &middot;{" "}
            {new Date(enquiry.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className={"badge status-" + enquiry.status}>{enquiry.status}</span>
      </div>

      <p className="enquiry-message">{enquiry.message}</p>

      {enquiry.offer !== null && <p className="enquiry-offer">Offer: ₹{enquiry.offer}</p>}

      {enquiry.response && <p className="enquiry-reply">Reply: {enquiry.response}</p>}

      {received && enquiry.status === "pending" && (
        <div className="enquiry-actions">
          <input
            className="input"
            type="text"
            placeholder="Optional reply message"
            aria-label="Reply message"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
          />
          <button
            type="button"
            className="btn btn-small"
            onClick={() => handleRespond("accepted")}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-small btn-outline"
            onClick={() => handleRespond("rejected")}
          >
            Reject
          </button>
        </div>
      )}
    </article>
  );
}

export default function EnquiriesPage() {
  const { data, update } = useMarketplace();

  if (!data) {
    return <p className="loading">Loading enquiries...</p>;
  }

  const myProductIds = data.products
    .filter((product) => product.sellerId === CURRENT_USER_ID)
    .map((product) => product.id);

  // Enquiries that other students sent on my listings.
  const received = data.enquiries.filter(
    (enquiry) => myProductIds.includes(enquiry.productId) && enquiry.buyerId !== CURRENT_USER_ID
  );

  // Enquiries that I sent to other sellers.
  const sent = data.enquiries.filter((enquiry) => enquiry.buyerId === CURRENT_USER_ID);

  const pendingCount = received.filter((enquiry) => enquiry.status === "pending").length;

  function findProduct(productId) {
    return data.products.find((product) => product.id === productId);
  }

  function handleRespond(enquiryId, status, response) {
    respondToEnquiry(update, enquiryId, status, response);
  }

  return (
    <div>
      <h2>Enquiries and Offers</h2>
      <p className="page-intro">Questions and price offers between buyers and sellers.</p>

      <div className="stats">
        <div className="stat">
          <strong>{received.length}</strong>
          <span>Received</span>
        </div>
        <div className="stat">
          <strong>{pendingCount}</strong>
          <span>Pending Response</span>
        </div>
        <div className="stat">
          <strong>{sent.length}</strong>
          <span>Sent by Me</span>
        </div>
      </div>

      <h3>Received Enquiries</h3>
      {received.length === 0 ? (
        <div className="empty">No enquiries received yet.</div>
      ) : (
        received.map((enquiry) => (
          <EnquiryCard
            key={enquiry.id}
            enquiry={enquiry}
            product={findProduct(enquiry.productId)}
            received={true}
            onRespond={handleRespond}
          />
        ))
      )}

      <h3>Enquiries I Sent</h3>
      {sent.length === 0 ? (
        <div className="empty">
          You have not sent any enquiry yet. Open a product and use the enquiry form.
        </div>
      ) : (
        sent.map((enquiry) => (
          <EnquiryCard
            key={enquiry.id}
            enquiry={enquiry}
            product={findProduct(enquiry.productId)}
            received={false}
            onRespond={handleRespond}
          />
        ))
      )}
    </div>
  );
}
