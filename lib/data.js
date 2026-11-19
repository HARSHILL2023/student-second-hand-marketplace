// Sample data for the student marketplace.
// Everything here is fake/mock data used to demonstrate the features.

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

export const CURRENT_USER_ID = "me";

// Sellers = students on campus. "me" is the logged in user.
export const sellers = {
  me: {
    id: "me",
    name: "You (Demo Student)",
    year: "2nd Year",
    branch: "Computer Science",
    email: "you@college.edu",
    phone: "98765 43210",
    hostel: "Hostel B - Room 214",
  },
  s1: {
    id: "s1",
    name: "Aarav Patel",
    year: "3rd Year",
    branch: "Mechanical Engineering",
    email: "aarav@college.edu",
    phone: "98123 45678",
    hostel: "Hostel A - Room 108",
  },
  s2: {
    id: "s2",
    name: "Riya Sharma",
    year: "2nd Year",
    branch: "Computer Science",
    email: "riya@college.edu",
    phone: "99887 66554",
    hostel: "Hostel C - Room 302",
  },
  s3: {
    id: "s3",
    name: "Kabir Singh",
    year: "4th Year",
    branch: "Electrical Engineering",
    email: "kabir@college.edu",
    phone: "97654 32109",
    hostel: "Hostel D - Room 45",
  },
};

// Products seeded on the first visit.
// status: "available" | "reserved" | "sold" | "inactive"
// Photos live in public/images, so the project also works offline.
export const sampleProducts = [
  {
    id: "p1",
    name: "Engineering Mathematics Textbook",
    description:
      "B.S. Grewal Higher Engineering Mathematics. Used for one semester only. No torn pages, a few pencil notes inside. Good for 1st year students.",
    price: 250,
    category: "Books",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p1-textbook.jpg",
    sellerId: "s1",
    createdAt: "2026-11-15T09:30:00.000Z",
  },
  {
    id: "p2",
    name: "Casio FX-991 Calculator",
    description:
      "Scientific calculator in working condition. All buttons work, battery is new. Useful for maths and physics exams.",
    price: 550,
    category: "Electronics",
    condition: "Like New",
    listingType: "For Sale",
    status: "available",
    image: "/images/p2-calculator.jpg",
    sellerId: "s2",
    createdAt: "2026-11-14T14:10:00.000Z",
  },
  {
    id: "p3",
    name: "Study Table with Drawer",
    description:
      "Wooden study table, 3 feet wide. One small drawer. Slight scratch on the top but very strong. Pick up only from Hostel B.",
    price: 1200,
    category: "Furniture",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p3-desk.jpg",
    sellerId: "s3",
    createdAt: "2026-11-13T11:00:00.000Z",
  },
  {
    id: "p4",
    name: "Wireless Mouse",
    description:
      "Logitech style wireless mouse with USB receiver. Works fine, used for 4 months. No box.",
    price: 300,
    category: "Electronics",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p4-mouse.jpg",
    sellerId: "s1",
    createdAt: "2026-11-12T16:45:00.000Z",
  },
  {
    id: "p5",
    name: "Data Structures Notes Bundle",
    description:
      "Handwritten notes + printed practice questions for Data Structures. Covers stacks, queues, trees and graphs. Free for juniors.",
    price: 0,
    category: "Stationery",
    condition: "Good",
    listingType: "Free",
    status: "available",
    image: "/images/p5-notes.jpg",
    sellerId: "s2",
    createdAt: "2026-11-11T08:15:00.000Z",
  },
  {
    id: "p6",
    name: "College Hoodie (Size M)",
    description:
      "Black college hoodie, size M. Worn a few times, washed and clean. Would like to exchange for a size L hoodie or a lab coat.",
    price: 0,
    category: "Clothing",
    condition: "Like New",
    listingType: "Exchange",
    status: "available",
    image: "/images/p6-hoodie.jpg",
    sellerId: "s3",
    createdAt: "2026-11-10T12:00:00.000Z",
  },
  {
    id: "p7",
    name: "Badminton Racket Pair",
    description:
      "Two badminton rackets with a cover. Gut is fine, grip is a little worn. Good for casual games in the evening.",
    price: 450,
    category: "Sports",
    condition: "Fair",
    listingType: "For Sale",
    status: "available",
    image: "/images/p7-rackets.jpg",
    sellerId: "s1",
    createdAt: "2026-11-09T18:20:00.000Z",
  },
  {
    id: "p8",
    name: "Table Lamp",
    description:
      "Small LED table lamp with warm light. Perfect for late night study. Plug works properly.",
    price: 350,
    category: "Furniture",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p8-lamp.jpg",
    sellerId: "s2",
    createdAt: "2026-11-08T20:05:00.000Z",
  },
  {
    id: "p9",
    name: "Organic Chemistry Textbook",
    description:
      "Second year organic chemistry textbook. Cover is slightly bent, all pages present.",
    price: 180,
    category: "Books",
    condition: "Fair",
    listingType: "For Sale",
    status: "available",
    image: "/images/p9-chemistry.jpg",
    sellerId: "s3",
    createdAt: "2026-11-07T10:40:00.000Z",
  },
  // Listings that belong to the current user ("me")
  {
    id: "p10",
    name: "Scientific Calculator (Old Model)",
    description:
      "Extra calculator lying in my room. Works properly, small scratch on the screen cover.",
    price: 400,
    category: "Electronics",
    condition: "Good",
    listingType: "For Sale",
    status: "available",
    image: "/images/p10-calculator-old.jpg",
    sellerId: "me",
    createdAt: "2026-11-16T09:00:00.000Z",
  },
  {
    id: "p11",
    name: "Drawing Board and T-Square",
    description:
      "Engineering drawing board with T-square and set square. Reserved for a junior who will pick it up on Monday.",
    price: 600,
    category: "Stationery",
    condition: "Good",
    listingType: "For Sale",
    status: "reserved",
    image: "/images/p11-drawing-board.jpg",
    sellerId: "me",
    createdAt: "2026-11-06T15:30:00.000Z",
  },
  {
    id: "p12",
    name: "First Year Physics Textbook",
    description: "Sold to a first year student last week. Kept here as listing history.",
    price: 220,
    category: "Books",
    condition: "Good",
    listingType: "For Sale",
    status: "sold",
    image: "/images/p12-physics.jpg",
    sellerId: "me",
    createdAt: "2026-10-28T13:15:00.000Z",
  },
];

// Enquiries received on the demo user's listings.
export const sampleEnquiries = [
  {
    id: "e1",
    productId: "p10",
    buyerName: "Riya Sharma",
    buyerId: "s2",
    message: "Hi, is the calculator still available? I can pick it up from the library today.",
    offer: 350,
    status: "pending",
    response: "",
    createdAt: "2026-11-17T10:20:00.000Z",
  },
  {
    id: "e2",
    productId: "p11",
    buyerName: "Aarav Patel",
    buyerId: "s1",
    message: "I need the drawing board for my lab. Can I collect it on Monday?",
    offer: null,
    status: "accepted",
    response: "Sure, Monday 5 PM at the hostel gate works for me.",
    createdAt: "2026-11-05T17:00:00.000Z",
  },
  {
    id: "e3",
    productId: "p12",
    buyerName: "Kabir Singh",
    buyerId: "s3",
    message: "Interested in the physics book. Would 200 be okay?",
    offer: 200,
    status: "rejected",
    response: "Sorry, the book is already sold.",
    createdAt: "2026-10-29T09:10:00.000Z",
  },
];
