// Demo data for `npm run seed` on an empty database.
// The app never imports this file at runtime; every page reads from MongoDB.

export const SEED_PASSWORD = "password123";

// Demo accounts. The password is the same for all of them (see above).
export const seedSellers = [
  { key: "s1", name: "Aarav Patel", email: "aarav@example.com", phone: "98123 45678" },
  { key: "s2", name: "Riya Sharma", email: "riya@example.com", phone: "99887 66554" },
  { key: "s3", name: "Kabir Singh", email: "kabir@example.com", phone: "97654 32109" },
  { key: "me", name: "Demo Student", email: "demo@example.com", phone: "98765 43210" },
];

// status: "available" | "reserved" | "sold" | "inactive"
// Photos live in public/images, so the demo also works offline.
export const sampleListings = [
  {
    sellerKey: "s1",
    name: "Engineering Mathematics Textbook",
    description:
      "B.S. Grewal Higher Engineering Mathematics. Used for one semester only. No torn pages, a few pencil notes inside. Good for 1st year students.",
    price: 250,
    category: "Books",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p1-textbook.jpg",
    createdAt: "2026-11-15T09:30:00.000Z",
  },
  {
    sellerKey: "s2",
    name: "Casio FX-991 Calculator",
    description:
      "Scientific calculator in working condition. All buttons work, battery is new. Useful for maths and physics exams.",
    price: 550,
    category: "Electronics",
    condition: "Like New",
    listingType: "For Sale",
    status: "available",
    image: "/images/p2-calculator.jpg",
    createdAt: "2026-11-14T14:10:00.000Z",
  },
  {
    sellerKey: "s3",
    name: "Study Table with Drawer",
    description:
      "Wooden study table, 3 feet wide. One small drawer. Slight scratch on the top but very strong. Pick up only from Hostel B.",
    price: 1200,
    category: "Furniture",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p3-desk.jpg",
    createdAt: "2026-11-13T11:00:00.000Z",
  },
  {
    sellerKey: "s1",
    name: "Wireless Mouse",
    description:
      "Logitech style wireless mouse with USB receiver. Works fine, used for 4 months. No box.",
    price: 300,
    category: "Electronics",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p4-mouse.jpg",
    createdAt: "2026-11-12T16:45:00.000Z",
  },
  {
    sellerKey: "s2",
    name: "Data Structures Notes Bundle",
    description:
      "Handwritten notes + printed practice questions for Data Structures. Covers stacks, queues, trees and graphs. Free for juniors.",
    price: 0,
    category: "Stationery",
    condition: "Good",
    listingType: "Free",
    status: "available",
    image: "/images/p5-notes.jpg",
    createdAt: "2026-11-11T08:15:00.000Z",
  },
  {
    sellerKey: "s3",
    name: "College Hoodie (Size M)",
    description:
      "Black college hoodie, size M. Worn a few times, washed and clean. Would like to exchange for a size L hoodie or a lab coat.",
    price: 0,
    category: "Clothing",
    condition: "Like New",
    listingType: "Exchange",
    status: "available",
    image: "/images/p6-hoodie.jpg",
    createdAt: "2026-11-10T12:00:00.000Z",
  },
  {
    sellerKey: "s1",
    name: "Badminton Racket Pair",
    description:
      "Two badminton rackets with a cover. Gut is fine, grip is a little worn. Good for casual games in the evening.",
    price: 450,
    category: "Sports",
    condition: "Fair",
    listingType: "For Sale",
    status: "available",
    image: "/images/p7-rackets.jpg",
    createdAt: "2026-11-09T18:20:00.000Z",
  },
  {
    sellerKey: "s2",
    name: "Table Lamp",
    description:
      "Small LED table lamp with warm light. Perfect for late night study. Plug works properly.",
    price: 350,
    category: "Furniture",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p8-lamp.jpg",
    createdAt: "2026-11-08T20:05:00.000Z",
  },
  {
    sellerKey: "s3",
    name: "Organic Chemistry Textbook",
    description:
      "Second year organic chemistry textbook. Cover is slightly bent, all pages present.",
    price: 180,
    category: "Books",
    condition: "Fair",
    listingType: "For Sale",
    status: "available",
    image: "/images/p9-chemistry.jpg",
    createdAt: "2026-11-07T10:40:00.000Z",
  },
  {
    sellerKey: "me",
    name: "Scientific Calculator (Old Model)",
    description:
      "Extra calculator lying in my room. Works properly, small scratch on the screen cover.",
    price: 400,
    category: "Electronics",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p10-calculator-old.jpg",
    createdAt: "2026-11-16T09:00:00.000Z",
  },
  {
    sellerKey: "me",
    name: "Drawing Board and T-Square",
    description:
      "Engineering drawing board with T-square and set square. Reserved for a junior who will pick it up on Monday.",
    price: 600,
    category: "Stationery",
    condition: "Good",
    listingType: "For Sale",
    status: "reserved",
    image: "/images/p11-drawing-board.jpg",
    createdAt: "2026-11-06T15:30:00.000Z",
  },
  {
    sellerKey: "me",
    name: "First Year Physics Textbook",
    description: "Sold to a first year student last week. Kept here as listing history.",
    price: 220,
    category: "Books",
    condition: "Good",
    listingType: "For Sale",
    status: "sold",
    image: "/images/p12-physics.jpg",
    createdAt: "2026-10-28T13:15:00.000Z",
  },
];
