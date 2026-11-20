// Small wrapper around fetch so every page handles API errors the same way.
export async function api(path, options = {}) {
  const config = {
    method: options.method || "GET",
    credentials: "same-origin",
    cache: "no-store",
  };

  if (options.body !== undefined) {
    config.headers = { "Content-Type": "application/json" };
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "The image could not be uploaded.");
  }

  return data.url;
}
