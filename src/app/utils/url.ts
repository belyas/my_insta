export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // Vercel/production: use process.env.NEXT_PUBLIC_VERCEL_URL or similar if needed
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}
