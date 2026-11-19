"use client";

import {
  BallIcon,
  BookIcon,
  BoxIcon,
  ChairIcon,
  LaptopIcon,
  PencilIcon,
  ShirtIcon,
} from "./Icons";

// Simple line icon used when a listing has no uploaded image.
const categoryIcons = {
  Books: BookIcon,
  Electronics: LaptopIcon,
  Furniture: ChairIcon,
  Stationery: PencilIcon,
  Clothing: ShirtIcon,
  Sports: BallIcon,
  Other: BoxIcon,
};

export function CategoryImage({ category }) {
  const Icon = categoryIcons[category] || BoxIcon;

  return (
    <span className="category-icon">
      <Icon />
    </span>
  );
}

// Price text depends on the listing type.
export function priceText(product) {
  if (product.listingType === "Free") return "Free";
  if (product.listingType === "Exchange") return "Exchange";
  return "₹" + product.price;
}
