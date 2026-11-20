// Convert database documents into the plain JSON shape the pages use.

export function publicUser(user) {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    phone: user.phone || "",
    createdAt: user.createdAt,
  };
}

export function listingJSON(listing, favoriteIds = []) {
  const id = listing._id.toString();
  const seller = listing.sellerId;

  return {
    id,
    // sellerId can be a plain ObjectId or a populated user document.
    sellerId: (seller && seller._id ? seller._id : seller).toString(),
    name: listing.name,
    description: listing.description,
    price: listing.price,
    category: listing.category,
    condition: listing.condition,
    image: listing.image || "",
    listingType: listing.listingType,
    status: listing.status,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    isFavorite: favoriteIds.includes(id),
  };
}

export function enquiryJSON(enquiry) {
  return {
    id: enquiry._id.toString(),
    listingName:
      enquiry.listingId && enquiry.listingId.name ? enquiry.listingId.name : "",
    listingStatus:
      enquiry.listingId && enquiry.listingId.status ? enquiry.listingId.status : "",
    sellerName:
      enquiry.sellerId && enquiry.sellerId.name ? enquiry.sellerId.name : "",
    sellerId: enquiry.sellerId
      ? (enquiry.sellerId._id ? enquiry.sellerId._id : enquiry.sellerId).toString()
      : "",
    listingId: (enquiry.listingId && enquiry.listingId._id
      ? enquiry.listingId._id
      : enquiry.listingId
    ).toString(),
    buyerId: (enquiry.buyerId && enquiry.buyerId._id
      ? enquiry.buyerId._id
      : enquiry.buyerId
    ).toString(),
    buyerName: enquiry.buyerId && enquiry.buyerId.name ? enquiry.buyerId.name : "Student",
    message: enquiry.message,
    offerPrice: enquiry.offerPrice,
    status: enquiry.status,
    response: enquiry.response || "",
    createdAt: enquiry.createdAt,
  };
}
