"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CONDITIONS, LISTING_TYPES } from "@/lib/data";
import { CategoryImage } from "./ProductImage";

// Shared form used by the "Create Listing" and "Edit Listing" pages.
export default function ListingForm({ initialValues, onSubmit, submitLabel }) {
  const router = useRouter();

  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [price, setPrice] = useState(
    initialValues && initialValues.price ? String(initialValues.price) : ""
  );
  const [category, setCategory] = useState(initialValues?.category || CATEGORIES[0]);
  const [condition, setCondition] = useState(initialValues?.condition || CONDITIONS[0]);
  const [listingType, setListingType] = useState(
    initialValues?.listingType || LISTING_TYPES[0]
  );
  const [image, setImage] = useState(initialValues?.image || "");
  const [error, setError] = useState("");

  // Read the chosen image file and keep it as a base64 string so it
  // can be saved in localStorage.
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "" || description.trim() === "") {
      setError("Please fill in the product name and description.");
      return;
    }

    if (listingType === "For Sale" && (price === "" || Number(price) <= 0)) {
      setError("Please enter a valid price for a 'For Sale' listing.");
      return;
    }

    setError("");

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: listingType === "For Sale" ? Number(price) : 0,
      category,
      condition,
      listingType,
      image,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="listing-name">Product Name</label>
        <input
          id="listing-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Engineering Mathematics Textbook"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="listing-description">Description</label>
        <textarea
          id="listing-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the item, its condition and pickup details."
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="listing-type">Listing Type</label>
          <select
            id="listing-type"
            value={listingType}
            onChange={(event) => setListingType(event.target.value)}
          >
            {LISTING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="listing-price">Price (₹)</label>
          <input
            id="listing-price"
            type="number"
            min="0"
            value={listingType === "For Sale" ? price : ""}
            onChange={(event) => setPrice(event.target.value)}
            placeholder={listingType === "For Sale" ? "e.g. 250" : "Not needed"}
            disabled={listingType !== "For Sale"}
          />
          <small>
            {listingType === "For Sale"
              ? "Enter the price you want."
              : "Free and Exchange listings do not need a price."}
          </small>
        </div>

        <div className="form-row">
          <label htmlFor="listing-category">Category</label>
          <select
            id="listing-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="listing-condition">Condition</label>
          <select
            id="listing-condition"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
          >
            {CONDITIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="listing-image">Product Image (optional)</label>
        <input
          id="listing-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <small>
          A preview is shown below. If no image is chosen, a category icon is used.
        </small>

        <div className="image-picker">
          {image ? (
            <>
              <img className="image-preview" src={image} alt="Selected product preview" />
              <button
                type="button"
                className="btn btn-small btn-outline"
                onClick={() => setImage("")}
              >
                Remove Image
              </button>
            </>
          ) : (
            <div className="image-placeholder">
              <CategoryImage category={category} />
            </div>
          )}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button className="btn" type="submit">
          {submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => router.push("/my-listings")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
