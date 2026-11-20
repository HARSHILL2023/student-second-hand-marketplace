"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { api } from "@/lib/apiClient";
import { useUser } from "@/components/UserProvider";

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("newest");

  // Wait a moment after typing before asking the server.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category !== "All") params.set("category", category);
    if (condition !== "All") params.set("condition", condition);

    if (priceRange === "under200") {
      params.set("maxPrice", "199");
    } else if (priceRange === "200-500") {
      params.set("minPrice", "200");
      params.set("maxPrice", "500");
    } else if (priceRange === "above500") {
      params.set("minPrice", "501");
    }

    params.set("sort", sort);
    return params.toString();
  }, [debouncedSearch, category, condition, priceRange, sort]);

  const userId = user ? user.id : "";

  // The user id is included so the saved stars refresh after login/logout.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api("/api/listings?" + query)
      .then((data) => {
        if (active) setListings(data.listings);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setListings([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, userId]);

  async function handleToggleFavorite(id) {
    if (!user) {
      router.push("/login");
      return;
    }

    const target = (listings || []).find((item) => item.id === id);
    if (!target) return;

    setError("");

    try {
      if (target.isFavorite) {
        await api("/api/favorites/" + id, { method: "DELETE" });
      } else {
        await api("/api/favorites", { method: "POST", body: { listingId: id } });
      }

      setListings((items) =>
        items.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } catch (favoriteError) {
      setError(favoriteError.message);
    }
  }

  return (
    <div>
      <h2>Marketplace</h2>
      <p className="page-intro">
        Buy, sell and exchange second-hand items with other students on campus.
      </p>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search products by name or description..."
          aria-label="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="filters">
          <select
            value={category}
            aria-label="Filter by category"
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={condition}
            aria-label="Filter by condition"
            onChange={(event) => setCondition(event.target.value)}
          >
            <option value="All">Any Condition</option>
            {CONDITIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            aria-label="Filter by price"
            onChange={(event) => setPriceRange(event.target.value)}
          >
            <option value="all">Any Price</option>
            <option value="under200">Under ₹200</option>
            <option value="200-500">₹200 - ₹500</option>
            <option value="above500">Above ₹500</option>
          </select>

          <select
            value={sort}
            aria-label="Sort listings"
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {listings === null ? (
        <p className="loading">Loading marketplace...</p>
      ) : (
        <>
          <p className="results-line">
            {listings.length} listing{listings.length === 1 ? "" : "s"} found
            {loading ? " - updating..." : ""}
          </p>

          {listings.length === 0 ? (
            <div className="empty">
              No products match your search. Try a different keyword or clear the filters.
            </div>
          ) : (
            <div className="product-grid">
              {listings.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={product.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
