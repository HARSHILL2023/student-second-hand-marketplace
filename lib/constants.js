// Shared option lists used by the forms and by the database models.

export const CATEGORIES = [
  "Books",
  "Electronics",
  "Furniture",
  "Stationery",
  "Clothing",
  "Sports",
  "Other",
];

export const CONDITIONS = ["New", "Like New", "Good", "Fair"];

export const LISTING_TYPES = ["For Sale", "Free", "Exchange"];

// Lowercase values keep the existing CSS classes (badge.status-available) working.
export const LISTING_STATUSES = ["available", "reserved", "sold", "inactive"];

export const ENQUIRY_STATUSES = ["pending", "accepted", "rejected"];
