/** Generate a nanoid-style ID with a prefix */
export function generateId(prefix: string): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  for (const b of bytes) {
    id += chars[b % chars.length];
  }
  return `${prefix}_${id}`;
}
