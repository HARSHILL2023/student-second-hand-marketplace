"use client";

import Link from "next/link";
import { StarIcon } from "./Icons";
import { CategoryImage, priceText } from "./ProductImage";

// One product card used on the marketplace, favorites and seller pages.
export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  return (
    <article className="product-card">
      <Link className="thumb" href={"/products/" + product.id} tabIndex={-1} aria-hidden="true">
        {product.image ? (
          <img src={product.image} alt="" />
        ) : (
          <CategoryImage category={product.category} />
        )}
      </Link>

      <span className="card-category">{product.category}</span>

      <Link href={"/products/" + product.id}>
        <h3>{product.name}</h3>
      </Link>

      <div className="card-bottom">
        <span className="price">{priceText(product)}</span>
        <span className="meta">{product.condition}</span>
      </div>

      <div className="card-footer">
        <Link className="btn btn-small btn-outline" href={"/products/" + product.id}>
          View Details
        </Link>

        {onToggleFavorite && (
          <button
            type="button"
            className="btn-fav"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={Boolean(isFavorite)}
            onClick={() => onToggleFavorite(product.id)}
          >
            <StarIcon filled={Boolean(isFavorite)} />
          </button>
        )}
      </div>
    </article>
  );
}
