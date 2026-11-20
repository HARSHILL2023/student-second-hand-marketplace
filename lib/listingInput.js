import {
  CATEGORIES,
  CONDITIONS,
  LISTING_STATUSES,
  LISTING_TYPES,
} from "./constants";
import { cleanString, toNumber } from "./validation";

// Validates a listing payload from the browser.
// Returns { values } on success or { error } with a message for the user.
// Pass { partial: true } when editing, so only sent fields are checked.
export function readListingInput(body, options = {}) {
  const partial = Boolean(options.partial);
  const values = {};
  const has = (field) => body[field] !== undefined;

  if (!partial || has("name")) {
    const name = cleanString(body.name);

    if (name.length < 3 || name.length > 120) {
      return { error: "Please enter a product name (3 to 120 characters)." };
    }

    values.name = name;
  }

  if (!partial || has("description")) {
    const description = cleanString(body.description);

    if (description.length < 10 || description.length > 2000) {
      return { error: "Please write a description (10 to 2000 characters)." };
    }

    values.description = description;
  }

  if (!partial || has("category")) {
    if (!CATEGORIES.includes(body.category)) {
      return { error: "Please choose a valid category." };
    }

    values.category = body.category;
  }

  if (!partial || has("condition")) {
    if (!CONDITIONS.includes(body.condition)) {
      return { error: "Please choose a valid condition." };
    }

    values.condition = body.condition;
  }

  if (!partial || has("listingType")) {
    if (!LISTING_TYPES.includes(body.listingType)) {
      return { error: "Please choose a valid listing type." };
    }

    values.listingType = body.listingType;
  }

  // Free and Exchange listings never have a price.
  if (values.listingType && values.listingType !== "For Sale") {
    values.price = 0;
  } else if (!partial || has("price")) {
    const price = toNumber(body.price);

    if (price === null || price < 0) {
      return { error: "Please enter a valid price." };
    }

    values.price = price;
  }

  if (has("image")) {
    const image = cleanString(body.image);

    if (image.length > 500) {
      return { error: "Image link is too long." };
    }

    if (image && !/^(https?:\/\/|\/)/.test(image)) {
      return { error: "Image link is not valid." };
    }

    values.image = image;
  }

  // Status can only be changed through an edit, never set on create.
  if (partial && has("status")) {
    if (!LISTING_STATUSES.includes(body.status)) {
      return { error: "Please choose a valid status." };
    }

    values.status = body.status;
  }

  return { values };
}
