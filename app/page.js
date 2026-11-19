"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, CONDITIONS } from "@/lib/data";
import { toggleFavorite, useMarketplace } from "@/lib/store";

export default function HomePage() {
  const { data, update } = useMarketplace();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("newest");

  if (!data) {
    return <p className="loading">Loading marketplace...</p>;
  }

  // 1. Only show products that are available (not sold / reserved / inactive)
  let products = data.products.filter((product) => product.status === "available");

  // 2. Search by name or description
  if (search.trim() !== "") {
    const text = search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(text) ||
        product.description.toLowerCase().includes(text)
    );
  }

  // 3. Filter by category
  if (category !== "All") {
    products = products.filter((product) => product.category === category);
  }

  // 4. Filter by condition
  if (condition !== "All") {
    products = products.filter((product) => product.condition === condition);
  }

  // 5. Filter by price
  if (priceRange === "under200") {
    products = products.filter((product) => product.price < 200);
  } else if (priceRange === "200-500") {
    products = products.filter((product) => product.price >= 200 && product.price <= 500);
  } else if (priceRange === "above500") {
    products = products.filter((product) => product.price > 500);
  }

  // 6. Sort
  products = [...products];
  if (sort === "newest") {
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    products.sort((a, b) => b.price - a.price);
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

      <p className="results-line">
        {products.length} listing{products.length === 1 ? "" : "s"} found
      </p>

      {products.length === 0 ? (
        <div className="empty">
          No products match your search. Try a different keyword or clear the filters.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={data.favorites.includes(product.id)}
              onToggleFavorite={(id) => toggleFavorite(update, id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
