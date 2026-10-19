/**
 * Helper to resolve poster and image URLs correctly across:
 * - Local development (base URL: '/')
 * - Production on GitHub Pages (base URL: '/iMovies/')
 * - External URLs (e.g. TMDB, Unsplash, http/https)
 */
export function getPosterUrl(path) {
  if (!path) return '';
  
  // Return external links, data URLs, or blob URLs directly
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Determine Vite base path (e.g. '/' or '/iMovies/')
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  // Normalize path by stripping redundant prefixes if present
  let cleanPath = path;
  if (cleanPath.startsWith('/iMovies/')) {
    cleanPath = cleanPath.slice('/iMovies/'.length);
  } else if (cleanPath.startsWith('iMovies/')) {
    cleanPath = cleanPath.slice('iMovies/'.length);
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }

  return `${normalizedBase}${cleanPath}`;
}

export const getImageUrl = getPosterUrl;
