/**
 * PayloadCMS API client for fetching content
 */

// Types matching PayloadCMS generated types
export interface Media {
  id: number;
  alt: string;
  url?: string | null;
  filename?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  date: string;
  image: number | Media;
  description: string;
  content?: {
    root: {
      type: string;
      children: unknown[];
      direction: ('ltr' | 'rtl') | null;
      format: string;
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  linkType?: ('detail' | 'project' | 'external') | null;
  project?: (number | null) | Project;
  externalUrl?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  year: string;
  image: number | Media;
  description: string;
  featured?: boolean | null;
  client?: string | null;
  heroVideo?: string | null;
  heroImage?: number | Media | null;
  content?: {
    root: {
      type: string;
      children: unknown[];
      direction: ('ltr' | 'rtl') | null;
      format: string;
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  externalLink?: {
    url?: string | null;
    label?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}

interface PayloadResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  page: number;
  totalDocs: number;
  totalPages: number;
}

// CMS URL - defaults to localhost in dev, can be overridden via env var
const rawUrl = import.meta.env.CMS_URL || (typeof process !== 'undefined' ? process.env.CMS_URL : undefined) || 'http://localhost:3000';
const CMS_URL = rawUrl.replace(/\/$/, '');

/**
 * Helper to flatten a nested object into Payload-style bracket notation
 * e.g. { slug: { equals: 'foo' } } -> { 'where[slug][equals]': 'foo' }
 */
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}[${key}]` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

/**
 * Generic fetch function for PayloadCMS API
 */
async function fetchFromCMS<T>(
  endpoint: string, 
  options: { locale?: 'en' | 'ja'; depth?: number; limit?: number; where?: Record<string, unknown> } = {}
): Promise<PayloadResponse<T>> {
  const { locale = 'en', depth = 1, limit = 100, where } = options;
  
  const params = new URLSearchParams({
    locale,
    depth: String(depth),
    limit: String(limit),
  });
  
  if (where) {
    const flattened = flattenObject(where, 'where');
    for (const [key, value] of Object.entries(flattened)) {
      params.append(key, value);
    }
  }
  
  const url = `${CMS_URL}/api/${endpoint}?${params}`;
  
  try {
    const response = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`CMS API error: ${response.status} ${response.statusText}`);
      return { docs: [], hasNextPage: false, hasPrevPage: false, limit, page: 1, totalDocs: 0, totalPages: 0 };
    }
    
    return response.json();
  } catch (error) {
    console.error('CMS fetch error:', error);
    return { docs: [], hasNextPage: false, hasPrevPage: false, limit, page: 1, totalDocs: 0, totalPages: 0 };
  }
}

/**
 * Fetch a Global from PayloadCMS
 */
async function fetchGlobalFromCMS<T>(
  slug: string, 
  options: { locale?: 'en' | 'ja'; depth?: number } = {}
): Promise<T | null> {
  const { locale = 'en', depth = 1 } = options;
  
  const params = new URLSearchParams({
    locale,
    depth: String(depth),
  });
  
  const url = `${CMS_URL}/api/globals/${slug}?${params}`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`CMS Global fetch error (${slug}):`, error);
    return null;
  }
}

/**
 * Fetch all news items
 */
export async function getNews(locale: 'en' | 'ja' = 'en'): Promise<News[]> {
  const response = await fetchFromCMS<News>('news', { 
    locale, 
    depth: 2 // Include related media and projects
  });
  return response.docs;
}

/**
 * Fetch a single news item by slug
 */
export async function getNewsBySlug(slug: string, locale: 'en' | 'ja' = 'en'): Promise<News | null> {
  const response = await fetchFromCMS<News>('news', { 
    locale, 
    depth: 2,
    where: { slug: { equals: slug } }
  });
  return response.docs[0] || null;
}

/**
 * Fetch all projects
 */
export async function getProjects(locale: 'en' | 'ja' = 'en'): Promise<Project[]> {
  const response = await fetchFromCMS<Project>('projects', { 
    locale, 
    depth: 1 // Include related media
  });
  return response.docs;
}

/**
 * Fetch featured projects for homepage
 * Prioritizes projects selected in the Settings global, then falls back to 'featured' flag
 */
export async function getFeaturedProjects(locale: 'en' | 'ja' = 'en', limit: number = 4): Promise<Project[]> {
  // 1. Try to get curated list from Settings
  const settings = await fetchGlobalFromCMS<{ featuredProjects?: Project[] }>('settings', { locale, depth: 2 });
  
  if (settings?.featuredProjects && settings.featuredProjects.length > 0) {
    return settings.featuredProjects.slice(0, limit);
  }

  // 2. Fallback to projects with featured=true
  const response = await fetchFromCMS<Project>('projects', { 
    locale, 
    depth: 1,
    limit,
    where: { featured: { equals: true } }
  });
  return response.docs;
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string, locale: 'en' | 'ja' = 'en'): Promise<Project | null> {
  const response = await fetchFromCMS<Project>('projects', { 
    locale, 
    depth: 2,
    where: { slug: { equals: slug } }
  });
  return response.docs[0] || null;
}

/**
 * Get the image URL from a media field
 */
export function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media) return null;
  if (typeof media === 'number') return null; // Not populated
  
  const url = media.url || null;
  if (!url) return null;
  
  // If the URL is already absolute (starts with http), return it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise, prepend the CMS URL
  return `${CMS_URL}${url}`;
}

/**
 * Get the CMS base URL for absolute URLs
 */
export function getCmsUrl(): string {
  return CMS_URL;
}
