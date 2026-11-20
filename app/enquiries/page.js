"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { useRequireAuth } from "@/components/UserProvider";

// One enquiry card. Used for both received and sent enquiries.
function EnquiryCard({ enquiry, received, onRespond, busy }) {
  const [reply, setReply] = useState("");

  return (
    <article className="enquiry">
      <div className="enquiry-head">
        <div>
          <h3>
            {enquiry.listingName ? (
              <Link href={"/products/" + enquiry.listingId}>{enquiry.listingName}</Link>
            ) : (
              "Listing removed"
            )}
          </h3>
          <p className="muted" style={{ margin: 0 }}>
            {received ? (
              <>
                From: <strong>{enquiry.buyerName}</strong>
              </>
            ) : (
              <>
                To: <strong>{enquiry.sellerName || "Seller"}</strong>
              </>
            )}{" "}
            &middot; {new Date(enquiry.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className={"badge status-" + enquiry.status}>{enquiry.status}</span>
      </div>

      <p className="enquiry-message">{enquiry.message}</p>

      {enquiry.offerPrice !== null && enquiry.offerPrice !== undefined && (
        <p className="enquiry-offer">Offer: ₹{enquiry.offerPrice}</p>
      )}

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
            disabled={busy}
            onClick={() => onRespond(enquiry.id, "accepted", reply)}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-small btn-outline"
            disabled={busy}
            onClick={() => onRespond(enquiry.id, "rejected", reply)}
          >
            Reject
          </button>
        </div>
      )}
    </article>
  );
}

export default function EnquiriesPage() {
  const { user, loading: sessionLoading } = useRequireAuth();

  const [inbox, setInbox] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    if (!user) return;

    let active = true;

    api("/api/enquiries")
      .then((data) => {
        if (active) setInbox(data);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setInbox({ received: [], sent: [] });
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function handleRespond(enquiryId, status, response) {
    setBusyId(enquiryId);
    setError("");

    const note =
      response.trim() !== ""
        ? response.trim()
        : status === "accepted"
        ? "Offer accepted. Please collect the item at the decided time."
        : "Sorry, I cannot accept this offer.";

    try {
      const data = await api("/api/enquiries/" + enquiryId, {
        method: "PATCH",
        body: { status, response: note },
      });

      setInbox((current) => ({
        ...current,
        received: current.received.map((item) =>
          item.id === enquiryId ? data.enquiry : item
        ),
      }));
    } catch (respondError) {
      setError(respondError.message);
    } finally {
      setBusyId("");
    }
  }

  if (sessionLoading || !user || inbox === null) {
    return <p className="loading">Loading enquiries...</p>;
  }

  const { received, sent } = inbox;
  const pendingCount = received.filter((item) => item.status === "pending").length;

  return (
    <div>
      <h2>Enquiries and Offers</h2>
      <p className="page-intro">Questions and price offers between buyers and sellers.</p>

      {error && <p className="form-error">{error}</p>}

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
            received={true}
            busy={busyId === enquiry.id}
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
            received={false}
            busy={false}
            onRespond={handleRespond}
          />
        ))
      )}
    </div>
  );
}
