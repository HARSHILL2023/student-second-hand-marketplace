"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { toggleFavorite, useMarketplace } from "@/lib/store";

export default function FavoritesPage() {
  const { data, update } = useMarketplace();

  if (!data) {
    return <p className="loading">Loading favorites...</p>;
  }

  const favoriteProducts = data.products.filter((product) =>
    data.favorites.includes(product.id)
  );

  return (
    <div>
      <h2>Favorites</h2>
      <p className="page-intro">Products you saved to look at later.</p>

      {favoriteProducts.length === 0 ? (
        <div className="empty">
          You have no favourite products yet. <Link href="/">Browse the marketplace</Link> and
          use the star button on any listing to save it here.
        </div>
      ) : (
        <div className="product-grid">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={true}
              onToggleFavorite={(id) => toggleFavorite(update, id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
