"use client";

// Small helper file that handles all localStorage reading/writing.
// Every page uses the useMarketplace() hook below to get the data.

import { useCallback, useEffect, useState } from "react";
import { sampleEnquiries, sampleProducts } from "./data";

const STORAGE_KEY = "student-marketplace";

// The shape of everything we save:
// { products: [...], favorites: [productId, ...], enquiries: [...] }
export function defaultData() {
  return {
    products: sampleProducts,
    favorites: ["p2"],
    enquiries: sampleEnquiries,
  };
}

export function loadData() {
  if (typeof window === "undefined") {
    return defaultData();
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const initial = defaultData();
      saveData(initial);
      return initial;
    }

    const parsed = JSON.parse(saved);

    // Older saved data has no photos. Fill in the sample photos so the
    // new pictures appear without deleting anything the user added.
    const seedImages = {};
    sampleProducts.forEach((product) => {
      seedImages[product.id] = product.image;
    });

    const products = (parsed.products || []).map((product) => {
      if (!product.image && seedImages[product.id]) {
        return { ...product, image: seedImages[product.id] };
      }
      return product;
    });

    return {
      products,
      favorites: parsed.favorites || [],
      enquiries: parsed.enquiries || [],
    };
  } catch (error) {
    // If the saved data is broken, start again with sample data.
    return defaultData();
  }
}

export function saveData(data) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Hook used by every page.
export function useMarketplace() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  // update() takes a function that receives the old data
  // and returns the new data. The new data is saved automatically.
  const update = useCallback((changeFn) => {
    setData((oldData) => {
      const newData = changeFn(oldData);
      saveData(newData);
      return newData;
    });
  }, []);

  return { data, update };
}

// Simple id generator, e.g. "p-1732000000000"
export function makeId(prefix) {
  return prefix + "-" + Date.now();
}

// --- Small actions used by the pages -------------------------------

export function addProduct(update, product) {
  update((data) => ({
    ...data,
    products: [product, ...data.products],
  }));
}

export function editProduct(update, productId, changes) {
  update((data) => ({
    ...data,
    products: data.products.map((product) =>
      product.id === productId ? { ...product, ...changes } : product
    ),
  }));
}

export function removeProduct(update, productId) {
  update((data) => ({
    ...data,
    products: data.products.filter((product) => product.id !== productId),
    favorites: data.favorites.filter((id) => id !== productId),
    enquiries: data.enquiries.filter((enquiry) => enquiry.productId !== productId),
  }));
}

export function toggleFavorite(update, productId) {
  update((data) => {
    const isFavorite = data.favorites.includes(productId);
    return {
      ...data,
      favorites: isFavorite
        ? data.favorites.filter((id) => id !== productId)
        : [...data.favorites, productId],
    };
  });
}

export function addEnquiry(update, enquiry) {
  update((data) => ({
    ...data,
    enquiries: [enquiry, ...data.enquiries],
  }));
}

export function respondToEnquiry(update, enquiryId, status, response) {
  update((data) => ({
    ...data,
    enquiries: data.enquiries.map((enquiry) =>
      enquiry.id === enquiryId ? { ...enquiry, status, response } : enquiry
    ),
  }));
}
