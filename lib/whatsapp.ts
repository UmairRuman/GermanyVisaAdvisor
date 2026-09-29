// TODO: client to provide the real WhatsApp Business number this should point to.
export const WHATSAPP_NUMBER = "000000000000";

export function buildWhatsAppLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
