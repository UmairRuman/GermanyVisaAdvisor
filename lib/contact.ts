// Single place for the consultancy's contact details.
export const CONTACT_EMAIL = "info@germanychlo.com";

export const BOOKING_PATH = "/book-appointment";

/** mailto: link with an optional pre-filled body — used where a message used to open WhatsApp. */
export function buildMailLink(body?: string, subject = "Enquiry from germanychlo.com") {
  const query = new URLSearchParams({ subject });
  if (body) query.set("body", body);
  return `mailto:${CONTACT_EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
}
