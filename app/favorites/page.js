"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/apiClient";
import { useRequireAuth } from "@/components/UserProvider";

export default function FavoritesPage() {
  const { user, loading: sessionLoading } = useRequireAuth();

  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let active = true;

    api("/api/favorites")
      .then((data) => {
        if (active) setFavorites(data.favorites);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setFavorites([]);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function handleToggleFavorite(id) {
    setError("");

    try {
      await api("/api/favorites/" + id, { method: "DELETE" });
      setFavorites((items) => items.filter((item) => item.id !== id));
    } catch (removeError) {
      setError(removeError.message);
    }
  }

  if (sessionLoading || !user || favorites === null) {
    return <p className="loading">Loading favorites...</p>;
  }

  return (
    <div>
      <h2>Favorites</h2>
      <p className="page-intro">Products you saved to look at later.</p>

      {error && <p className="form-error">{error}</p>}

      {favorites.length === 0 ? (
        <div className="empty">
          You have no favourite products yet. <Link href="/">Browse the marketplace</Link> and
          use the star button on any listing to save it here.
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
